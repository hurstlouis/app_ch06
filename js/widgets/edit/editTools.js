/*global define, console, alert, prompt*/
/*jslint nomen: true*/
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dojo/dom-class',
    'dojo/dom-attr',
    'dojo/query',
    'esri/graphic',
    'widgets/edit/editService',
    'utils/symbolUtil',
    'text!widgets/edit/editTools.tpl.html'
], function (
    declare,
    lang,
    on,
    _WidgetBase,
    _TemplatedMixin,
    domClass,
    domAttr,
    query,
    Graphic,
    EditService,
    symbolUtil,
    template
) {
    'use strict';
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        options: {},
        editing: false,
        map: null,

        constructor: function (options) {
            this.options = options || {};
            this.map = this.options.map;
            this.requestLayer = this.map.getLayer('Requests');

            this.editService = new EditService({
                layer: this.requestLayer
            });
        },
        postCreate: function () {
            this.handler = on.pausable(
                this.map,
                'click',
                lang.hitch(this, '_addPoint')
            );
            this.handler.pause();
            this.own(
                on(
                    this.domNode,
                    '.btn-edit:click',
                    lang.hitch(this, '_toggleEditButton')
                ),
                on(
                    this.domNode,
                    'btn-sync:click',
                    lang.hitch(this, '_syncLocal')
                )
            );
        },

        _addRequest: function () {
            this._toggleEditButton();
        },
        _syncLocal: function () {
            console.debug('has local?', this.editService.hasLocal);
            if (this.editService.hasLocal) {
                this.editService.sync();
            }
        },
        _addPoint: function (e) {
            var mapPt = e.mapPoint, census = e.graphic, attributes = {}, graphic, description;
            description = prompt('Description of Request');
            attributes.IssueType = 'New Request';
            attributes.RequestDate = new Date().getTime();
            attributes.CensusTract = census.attributes.NAME;
            attributes.Description = description;
            console.debug('attr', attributes);

            graphic = new Graphic(mapPt, symbolUtil.simpleMarker(), attributes);

            this.editService.add([graphic]).then(
                lang.hitch(this, function () {
                    this._toggleEditButton();
                    this.map.graphics.add(graphic);
                    alert('Request Submitted');
                }),
                lang.hitch(this, function () {
                    this._toggleEditButton();
                    this.map.graphics.add(graphic);
                    alert('Request Saved Locally');
                })
            );
/*             this.requestLayer.applyEdits([graphic])
                .then(lang.hitch(this, function () {
                    this._toggleEditButton();
                    alert('Request Submited');
                }));
 */
        },
        _toggleEditButton: function (e) {
            this.editing = !this.editing;
            this.requesttype = '';
            if (e) {
                this.requesttype = domAttr.get(e.target, 'data-type');
                domClass.toggle(e.target, 'btn-primary btn-success');
            }
            if (this.editing) {
                query('.btn-primary', this.domNode)
                    .removeClass('btn-primary')
                        .attr('disabled', 'disabled');
                this.handler.resume();
            } else {
                query('.btn-edit', this.domNode)
                    .removeClass('btn-success')
                        .addClass('btn-primary')
                            .removeAttr('disabled');
                this.handler.pause();
            }
        }
    });
});
/*jslint nomen: false*/
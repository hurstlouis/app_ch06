/*global define */
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/on',
    'esri/toolbars/edit',
    'utils/symbolUtil'
], function (declare, lang, arrayUtil, on, Edit, symbolUtil) {
    'use strict';
    return declare(null, {
        constructor: function (options) {
            this.map = options.map;
            this.editLayer = options.editLayer;
        },

        init: function () {
            this.editToolbar = new Edit(this.map);

            this.isEditing = false;
            on(this.editToolbar, 'deactivate', lang.hitch(this, 'onEditDeactivate'));

            on(this.editLayer, 'dbl-click', lang.hitch(this, 'onMoveFeature'));
        },

        onEditDeactivate: function (e) {
            if (e.info.isModified) {
                e.graphic.setSymbol(this.defaultSymbol);
                this.editLayer.applyEdits(null, [e.graphic], null);
            }
        },

        onMoveFeature: function (e) {
            e.preventDefault();
            if (!this.isEditing) {
                this.isEditing = true;
                this.defaultSymbol = e.graphic.symbol;

                e.graphic.setSymbol(symbolUtil.selectedSymbol());
                this.editToolbar.activate(Edit.MOVE, e.graphic);
            } else {
                this.isEditing = false;
                this.editToolbar.deactivate();
            }
        }
    });
});
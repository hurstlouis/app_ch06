/*global define, console, window */
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/on',
    'dojo/dom',
    'esri/map',
    'esri/tasks/GeometryService',
    'esri/config',
    'esri/domUtils',
    'esri/dijit/Measurement',
    'esri/dijit/BasemapToggle',
    'esri/IdentityManager'
], function (declare, lang, on, dom, Map, GeometryService, esriConfig, domUtils, Measurement, BasemapToggle, esriID) {
    'use strict';
    esriID.setProtocolErrorHandler(function () {
        console.log("Protocol mismatch error");
        return window.confirm("Protocol mismatch error ... proceed anyway");
    });
    var url = 'http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer';
    return declare(null, {
        map: null,
        options: {},

        constructor: function (options) {
            this.options = options;
            esriConfig.defaults.geometryService = new GeometryService(url);
        },

        load: function () {
            this.map = new Map(this.options.elem, this.options.mapOptions);
            on(this.map, 'load', lang.hitch(this, 'onMapLoad'));

            on(dom.byId('measurement-toggle'), 'click', lang.hitch(this, 'toggleMeasurement'));
            this.map.addLayers(this.options.layers);
        },

        onMapLoad: function () {
            this.measurement = new Measurement({
                map: this.map
            }, 'measurement-div');
            domUtils.hide(dom.byId('measurement-div'));
            this.measurement.startup();
            this.basemaps = new BasemapToggle({
                map: this.map,
                basemap: 'hybrid',
                }, 'basemap-div');
            this.basemaps.startup();
        },

        toggleMeasurement: function (e) {
            e.preventDefault();
            domUtils.toggle(this.measurement.domNode);
        }
    });
});
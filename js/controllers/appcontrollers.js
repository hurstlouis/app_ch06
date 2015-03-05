/*global */
define([
    'dojo/_base/declare',
    'esri/map',
    'esri/IdentityManager'
], function (declare, Map, esriID) {
    'use strict';
    esriID.setProtocolErrorHandler(function () {
        console.log("Protocol mismatch error");
        return window.confirm("Protocol mismatch error ... proceed anyway");
    });
    return declare(null, {
        map: null,
        options: {},
        
        constructor: function (options) {
            this.options = options;
        },
        load: function () {
            this.map = new Map(this.options.elem, this.options.mapOptions);
            this.map.addLayers(this.options.layers);
        }
    });
});
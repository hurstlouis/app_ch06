/*global define*/
/*jslint nomen: true*/
define([
    'esri/layers/FeatureLayer',
    'esri/renderers/SimpleRenderer',
    'utils/symbolUtil'
], function (FeatureLayer, SimpleRenderer, symbolUtil) {
    'use strict';
    var CENSUS_URL = 'https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CensusLaborDemo/FeatureServer/1',
        REQUEST_URL = 'https://services3.arcgis.com/0e6Q3IOFZo94CDVM/arcgis/rest/services/Requests/FeatureServer/0';
    function _loadServices() {
        var layers = [],
            censusLayer = new FeatureLayer(CENSUS_URL, {
                id: 'Census'
            }),
            requestLayer = new FeatureLayer(REQUEST_URL, {
                id: 'Requests',
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ['*']
            }),
            renderer = new SimpleRenderer(symbolUtil.renderSymbol());
        censusLayer.setRenderer(renderer);

        layers.push(censusLayer);
        layers.push(requestLayer);

        return layers;
    }

    return {
        loadServices: _loadServices
    };
});
/*jslint nomen: false*/
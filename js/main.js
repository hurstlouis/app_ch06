/*global require,startApplication*/
require([
    'controllers/appcontrollers',
    'services/mapservices',
    'esri/config',
    'dojo/domReady!'
], function (AppCtrl, mapServices, esriConfig) {
    "use strict";
    esriConfig.defaults.io.proxyUrl = "../proxy/proxy.ashx";
    esriConfig.defaults.io.alwaysUseProxy = false;
    var appCtrl;

    appCtrl = new AppCtrl({
        elem: 'map-div',
        mapOptions: {
            basemap: 'streets',
            center: [-118.241, 34.0542],
            zoom: 12
        },
        layers: mapServices.loadServices()
    });
    appCtrl.load();
});
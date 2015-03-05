/*global require,startApplication, location */
require([
    'esri/config',
    'dojo/dom',
    'dojo/on',
    'esri/arcgis/OAuthInfo',
    'esri/IdentityManager',

    'utils/securityUtil',
    'controllers/appcontrollers',
    'services/mapservices',
    'dojo/domReady!'
], function (esriConfig, dom, on, OAuthInfo, esriId, securityUtil, AppCtrl, mapServices) {
    "use strict";
    esriConfig.defaults.io.proxyUrl = "../proxy/proxy.ashx";
    esriConfig.defaults.io.alwaysUseProxy = false;
    var appCtrl, info;
    info = new OAuthInfo({
        appId: '04CCWEEVujjNxBbe',
        portal: 'http://www.arcgis.com',
        popup: false
    });

    esriId.registerOAuthInfos([info]);

    function startApplication() {
        dom.byId('signin-elem').innerHTML = 'Sign Out';
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
    }

    function clearApplication() {
        securityUtil.removeCredentials();
        esriId.destroyCredentials();
        location.reload();
    }

    esriId.checkSignInStatus(info.portalUrl)
        .then(function () {
            securityUtil.saveCredentials().then(startApplication);
        })
        .otherwise(
            function () {
                securityUtil.loadCredentials().then(function (success) {
                    if (success) {
                        startApplication();
                    }
                });

            }
        );
    on(dom.byId('signin-elem'), 'click', function (e) {
        e.preventDefault();
        if (e.target.innerHTML === 'Sign In') {
            esriId.getCredential(info.portalUrl)
                .then(startApplication);
        } else {
            clearApplication();
        }
    });
});
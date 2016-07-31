(function () {
  'use strict';

  var L = require('leaflet');
  var leafletKnn = require('leaflet-knn');
  require('leaflet.markercluster');
  require('leaflet-providers');

  var baseLayers = {
    'Open Street Map': L.tileLayer.provider('Thunderforest.Outdoors'),
    'Imagery': L.tileLayer.provider('Esri.WorldImagery')
  };

  module.exports = {
    baseLayers: baseLayers
  };

})();

(function () {
  'use strict';

  var L = require('leaflet');

  var blueGoose = L.icon({
    iconUrl: './svg/blue-goose.svg',
    iconSize: [50, 70],
    popupAnchor: [0, -10]
  });

  var office = L.icon({
    iconUrl: './svg/building.svg',
    iconSize: [70, 50],
    popupAnchor: [0, -20]
  });

  var fisheries = L.icon({
    iconUrl: './svg/fisheries.svg',
    iconSize: [70, 50],
    popupAnchor: [7, -25]
  });

  module.exports = {
    blueGoose: blueGoose,
    office: office,
    fisheries: fisheries
  };
})();

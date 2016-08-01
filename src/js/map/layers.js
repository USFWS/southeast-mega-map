(function () {
  'use strict';

  var L = require('leaflet');
  var emitter = require('../mediator');
  require('leaflet.markercluster');
  require('leaflet-providers');

  var offices,
      map,
      overlays,
      cluster;

  var baseLayers = {
    'Open Street Map': L.tileLayer.provider('Thunderforest.Outdoors'),
    'Imagery': L.tileLayer.provider('Esri.WorldImagery')
  };

  function init(officeData, theMap) {
    offices = officeData;
    map = theMap;

    overlays = {
      "Refuges": createOfficeLayer('National Wildlife Refuge'),
      "Hatcheries": createOfficeLayer('National Fish Hatchery'),
      "Ecological Services": createOfficeLayer('Ecological Services Field Office'),
      "Fish and Wildlife Conservation Offices": createOfficeLayer('Fish And Wildlife Conservation Office')
    };

    cluster = L.markerClusterGroup({
      showCoverageOnHover: false
    });

    // There seems to be an issue with adding multiple layers in markercluster beta
    // https://github.com/Leaflet/Leaflet.markercluster/issues/623
    // cluster.addLayers([ refuges, hatcheries, es, conservationOffices ]);
    cluster.addLayer(overlays.Refuges);
    cluster.addLayer(overlays.Hatcheries);
    cluster.addLayer(overlays["Ecological Services"]);
    cluster.addLayer(overlays["Fish and Wildlife Conservation Offices"]);

    return {
      overlays: overlays,
      cluster: cluster
    };

  }

  function createOfficeLayer(type) {
    return L.geoJson(offices, {
      filter: function (feature, latlng) {
        switch (feature.properties.type) {
          case type: return true;
          default: return false;
        }
      },
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer
    }).on('mouseover', function(e) {
      e.layer.openPopup();
    }).on('mouseout', function(e) {
      e.layer.closePopup();
    });
  }

  function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.name);
    layer.on({ click: onMarkerClick });
  }

  function pointToLayer(feature, latlng) {
    var icons = require('../icons');
    var type = feature.properties.type;
    if (type === 'National Wildlife Refuge') return L.marker(latlng, { icon: icons.blueGoose });
    else if (type === 'National Fish Hatchery') return L.marker(latlng, { icon: icons.fisheries });
    else return L.marker(latlng, { icon: icons.office });
  }

  function onMarkerClick(feature) {
    var office = feature.target.feature;
    flyToOffice(office);
    emitter.emit('marker:click', office);
  }

  function flyToOffice(office) {
    // Clone the coordinates array
    var latlng = office.geometry.coordinates.slice(0).reverse();
    // Account for detail panel opening
    latlng[1] = latlng[1] - 0.135;
    map.flyTo(latlng, 11);
  }

  module.exports = {
    init: init,
    baseLayers: baseLayers,
    overlays: overlays,
    cluster: cluster
  };

})();

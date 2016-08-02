(function () {
  'use strict';

  var L = require('leaflet');
  var emitter = require('../mediator');
  var _ = require('../util');
  require('leaflet.markercluster');
  require('leaflet-providers');
  require('./marker-cluster-layer-support');

  var offices,
      map,
      cluster = L.markerClusterGroup.layerSupport();

  var baseLayers = {
    'ESRI Oceans': L.tileLayer.provider('Esri.OceanBasemap'),
    'Imagery': L.tileLayer.provider('Esri.WorldImagery')
  };

  var states = L.tileLayer.wms('https://maps.bts.dot.gov/services/services/NTAD/States/MapServer/WmsServer?', {
    format: 'image/png',
    transparent: true,
    layers: '0',
    attribution: '<a href="http://osav.usdot.opendata.arcgis.com/datasets/34f8a046fef944f39d8a65004a431a1f_0">Dept. of Transportation</a>'
  });

  function init(officeData, layersOnLoad, theMap) {
    offices = officeData;
    map = theMap;
    var overlays = {
      'Refuges': L.layerGroup().addLayer( createOfficeLayer('National Wildlife Refuge') ),
      'Hatcheries': L.layerGroup().addLayer( createOfficeLayer('National Fish Hatchery') ),
      'Ecological Services': L.layerGroup().addLayer( createOfficeLayer('Ecological Services Field Office') ),
      'Fish and Wildlife Conservation Offices': L.layerGroup().addLayer( createOfficeLayer('Fish And Wildlife Conservation Office') )
    };
    var control = L.control.layers(baseLayers, overlays);

    if (layersOnLoad) addSomeLayers(overlays, layersOnLoad);
    else addAllLayers(overlays);

    control.addOverlay(states, 'State Boundaries');
    control.addTo(map);
    cluster.addTo(map);

    map.on('overlayadd', layerAdd);
    map.on('overlayremove', layerRemove);
  }

  function addAllLayers(overlays) {
    _.map(overlays, function(layer, key) {
      cluster.checkIn(layer);
      cluster.addLayer(layer);
    });
  }

  function getBounds() {
    return cluster.getBounds();
  }

  function addSomeLayers(overlays, layers) {
    _.map(overlays, function(layer, key) {
      cluster.checkIn(layer);
      if (_.includes(layers, key.toLowerCase())) cluster.addLayer(layer);
    });
  }

  function layerAdd(layer) {
    if (layer.name === 'State Boundaries') return;
    cluster.addLayer(layer);
  }

  function layerRemove(layer) {
    if (layer.name === 'State Boundaries') return;
    cluster.removeLayer(layer);
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
    console.log(office);
    // Clone the coordinates array
    var latlng = office.geometry.coordinates.slice(0).reverse();
    // Account for detail panel opening
    latlng[1] = latlng[1] - 0.135;
    map.flyTo(latlng, 11);
  }

  module.exports = {
    init: init,
    flyToOffice: flyToOffice,
    baseLayers: baseLayers,
    getBounds: getBounds,
    cluster: cluster
  };

})();

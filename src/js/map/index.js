(function () {

  var L = require('leaflet');
  var leafletKnn = require('leaflet-knn');
  var emitter = require('../mediator');
  var mapLayers = require('./layers');

  var _  = require('../util');

  L.Icon.Default.imagePath = './images';

  var opts, map, cluster, index, layers;
  var defaults = {
    zoom: 7,
    mapId: 'map'
  };

  function init(options) {
    opts = _.defaults({}, options, defaults);
    index = leafletKnn( L.geoJson(opts.data) );
    createMap();
    opts.fullExtent = _.create('button', ['tt-w', 'zoom-to-full-extent', 'leaflet-control-roy'], document.body);
    opts.fullExtent.setAttribute('data-tt', 'Zoom to full extent');
    opts.nearest = _.create('button', ['find-nearest', 'tt-w', 'leaflet-control-roy'], document.body);
    opts.nearest.setAttribute('data-tt', 'Find nearest offices');
    opts.imgLocate = _.create('img', '', opts.nearest);
    opts.imgLocate.setAttribute('src', './svg/current-location.svg');
    opts.imgExtent = _.create('img', '', opts.fullExtent);
    opts.imgExtent.setAttribute('src', './svg/full-extent.svg');
    registerHandlers();
    if (opts.data) addMarkers();
    return opts.map;
  }

  function registerHandlers() {
    emitter.on('office:selected', mapLayers.flyToOffice);
    emitter.on('detail:hide', panMap);
    emitter.on('detail:show', panMap);
    opts.fullExtent.addEventListener('click', zoomToFullExtent);
    opts.nearest.addEventListener('click', getLocation);
    map.on('click', blurInput);
    map.on('locationfound', findNearest);
  }

  function getLocation() {
    _.addClass(opts.nearest, 'loading');
    opts.imgLocate.setAttribute('src', './svg/loading.svg');
    map.locate();
  }

  function panMap(distance) {
    map.panBy([distance, 0]);
  }

  function blurInput() {
    emitter.emit('blur:input');
  }

  function zoomToFullExtent() {
    map.flyToBounds(cluster.getBounds());
    emitter.emit('zoom:fullextent');
  }

  function createMap() {

    var mapOptions = {
      zoomControl: false,
      layers: [mapLayers.baseLayers['Open Street Map']]
    };
    map = L.map(opts.mapId, mapOptions);
    map.fitBounds(opts.bounds);

    var states = L.tileLayer.wms('https://maps.bts.dot.gov/services/services/NTAD/States/MapServer/WmsServer?', {
      format: 'image/png',
      transparent: true,
      layers: '0',
      attribution: '<a href="http://osav.usdot.opendata.arcgis.com/datasets/34f8a046fef944f39d8a65004a431a1f_0">Dept. of Transportation</a>'
    }).addTo(map);

    var overlays = {
      "Refuges": L.layerGroup().addTo(map),
      "Hatcheries": L.layerGroup().addTo(map),
      "Ecological Services": L.layerGroup().addTo(map),
      "Fish and Wildlife Conservation Offices": L.layerGroup().addTo(map),
      "State Boundaries": states
    };

    new L.Control.Zoom({ position: 'bottomleft' }).addTo(map);
    L.control.layers(mapLayers.baseLayers, overlays).addTo(map);

    return map;
  }

  function findNearest(e) {
    L.popup().setLatLng(e.latlng).setContent('Your Current Location').openOn(map);
    var nearest = index.nearest(e.latlng, 10);
    _.removeClass(opts.nearest, 'loading');
    opts.imgLocate.setAttribute('src', './svg/current-location.svg');
    emitter.emit('found:nearest', nearest);
  }

  function addMarkers() {
    var data = mapLayers.init(opts.data, map);
    layers = data.overlays;
    cluster = data.cluster;

    map.addLayer(cluster);
  }

  module.exports.init = init;

})();


// Map.js
//
// Deal with query parameters first
//  Figure out the bounds of the map (?office= or ?state=)
//  Figure out what layers to enable
//
// Pass in some options to a Map constructor

// Map buttons
//
// Should be in a separate file

// Refactor
// Use jade to template out tool buttons

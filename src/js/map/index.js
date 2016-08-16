(function () {

  var L = require('leaflet');
  var leafletKnn = require('leaflet-knn');
  var emitter = require('../mediator');
  var mapLayers = require('./layers');
  var OfficeService = require('../offices');

  var _  = require('../util');

  L.Icon.Default.imagePath = './images';

  var opts, map, cluster, index, layers;
  var defaults = {
    zoom: 7,
    mapId: 'map',
    disableScrollSelector: '.disable-scroll-wheel'
  };

  function init(options) {
    opts = _.defaults({}, options, defaults);
    index = leafletKnn( L.geoJson(opts.data) );
    opts.fullExtent = _.create('button', ['tt-w', 'zoom-to-full-extent', 'leaflet-control-roy'], document.body);
    opts.fullExtent.setAttribute('data-tt', 'Zoom to full extent');
    opts.nearest = _.create('button', ['find-nearest', 'tt-w', 'leaflet-control-roy'], document.body);
    opts.nearest.setAttribute('data-tt', 'Find nearest offices');
    opts.imgLocate = _.create('img', '', opts.nearest);
    opts.imgLocate.setAttribute('src', './svg/current-location.svg');
    opts.imgLocate.setAttribute('alt', 'Icon representing your current location');
    opts.imgExtent = _.create('img', '', opts.fullExtent);
    opts.imgExtent.setAttribute('src', './svg/full-extent.svg');
    opts.imgExtent.setAttribute('alt', 'Icon representing zoom to full extent');
    createMap();
    registerHandlers();
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
    map.flyToBounds(mapLayers.getBounds());
    emitter.emit('zoom:fullextent');
  }

  function createMap() {
    var mapDiv = document.getElementById(opts.mapId);
    var disable = _.closest(mapDiv, opts.disableScrollSelector);
    var mapOptions = {
      zoomControl: false,
      layers: [mapLayers.baseLayers['ESRI National Geographic']]
    };

    if ( disable ) mapOptions.scrollWheelZoom = false;

    map = L.map(opts.mapId, mapOptions);
    map.fitBounds(opts.bounds);
    mapLayers.init(opts.data, opts.layers, map);

    if (opts.initOnOffice)
      mapLayers.flyToOffice( OfficeService.getOffice(opts.initOnOffice) );

    new L.Control.Zoom({ position: 'bottomright' }).addTo(map);

    return map;
  }

  function findNearest(e) {
    L.popup().setLatLng(e.latlng).setContent('Your Current Location').openOn(map);
    var nearest = index.nearest(e.latlng, 10);
    _.removeClass(opts.nearest, 'loading');
    opts.imgLocate.setAttribute('src', './svg/current-location.svg');
    emitter.emit('found:nearest', nearest);
  }

  function shouldDisableScrollWheel(node) {
    var nodeHasClass = _.hasClass(node, opts.disableScrollClass);
    var parentHasClass = _.hasClass(node.parentNode, opts.disableScrollClass);
    if (nodeHasClass || parentHasClass) return true;
    else return false;
  }

  module.exports.init = init;

})();

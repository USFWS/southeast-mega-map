(function () {

  var L = require('leaflet');
  require('leaflet.markercluster');
  var qs = require('./querystring');
  var emitter = require('./mediator');
  var domUtil = require('./domUtil');

  var _  = require('./util')._;

  L.Icon.Default.imagePath = './images';

  var opts, map, cluster;
  var defaults = {
    zoom: 7,
    mapId: 'map',
    basemap: {
      url: 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
      attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  };

  function init(options) {
    opts = _.defaults({}, options, defaults);
    createMap();
    opts.fullExtent = domUtil.create('button', 'zoom-to-full-extent', document.body);
    domUtil.addClass(opts.fullExtent, 'leaflet-control');
    opts.img = domUtil.create('img', '', opts.fullExtent);
    opts.img.setAttribute('src', '../svg/full-extent.svg');
    opts.img.setAttribute('title', 'Zoom to full extent');
    registerHandlers();
    if (opts.data) addMarkers();
  }

  function flyToOffice(office) {
    // Clone the coordinates array
    var latlng = office.geometry.coordinates.slice(0).reverse();
    // Account for detail panel opening
    latlng[1] = latlng[1] - 0.135;
    map.flyTo(latlng, 11);
  }

  function registerHandlers() {
    emitter.on('office:selected', flyToOffice);
    emitter.on('detail:hide', panMap);
    emitter.on('detail:show', panMap);
    opts.fullExtent.addEventListener('click', zoomToFullExtent);
    map.on('click', blurInput);
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
    var basemap = L.tileLayer(opts.basemap.url, {
      attribution: opts.basemap.attribution
    });

    var mapOptions = {
      center: opts.center,
      zoom: opts.zoom,
      zoomControl: false,
      layers: [basemap]
    };

    map = L.map(opts.mapId, mapOptions);
    new L.Control.Zoom({ position: 'topright' }).addTo(map);
  }

  function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.name);
    layer.on({ click: onMarkerClick });
  }

  function onMarkerClick(feature) {
    var office = feature.target.feature;
    flyToOffice(office);
    emitter.emit('marker:click', office);
  }

  function addMarkers() {
    var geojson = L.geoJson(opts.data, {
      onEachFeature: onEachFeature,
    });

    cluster = L.markerClusterGroup({
      showCoverageOnHover: false
    }).addLayer(geojson);

    map.addLayer(cluster);
    map.fitBounds(cluster.getBounds());
  }

  module.exports.init = init;

})();

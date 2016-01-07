(function () {

  var L = require('leaflet');
  require('leaflet.markercluster');
  var qs = require('./querystring');
  var emitter = require('./mediator');

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
    opts.fullExtent = document.createElement('button');
    opts.fullExtent.classList.add('leaflet-control', 'zoom-to-full-extent');
    var img = document.createElement('img');
    img.setAttribute('src', '../images/full-extent.svg');
    img.setAttribute('title', 'Zoom to full extent');
    opts.fullExtent.appendChild(img);
    document.body.appendChild(opts.fullExtent);
    registerHandlers();
    if (opts.data) addMarkers();
  }

  function flyToOffice(office) {
    // Clone the coordinates array
    var latlng = office.geometry.coordinates.slice(0).reverse();
    map.flyTo(latlng, 11);
  }

  function registerHandlers() {
    emitter.on('office:selected', flyToOffice);
    opts.fullExtent.addEventListener('click', zoomToFullExtent);
  }

  function zoomToFullExtent() {
    map.fitBounds(cluster.getBounds());
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

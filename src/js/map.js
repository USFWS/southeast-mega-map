(function () {

  var L = require('leaflet');
  var qs = require('./querystring');
  var emitter = require('./mediator');
  var OfficeService = require('./offices');

  var _  = require('./util')._;

  L.Icon.Default.imagePath = './images';

  var opts, map;
  var defaults = {
    zoom: 7,
    mapId: 'map',
    basemap: {
      url: 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
      attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }
  };

  function flyToOffice(office) {
    var target = OfficeService.getOffice(office.properties.name);
    // Clone the coordinates array
    var latlng = target.geometry.coordinates.slice(0).reverse();
    map.flyTo(latlng, 11);
  }

  function init(options) {
    opts = _.defaults({}, options, defaults);
    createMap();
    registerHandlers();
    if (opts.data) addMarkers();
  }

  function registerHandlers() {
    emitter.on('office:selected', flyToOffice);
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
    }).addTo(map);

    map.fitBounds(geojson.getBounds());
  }

  module.exports.init = init;

})();

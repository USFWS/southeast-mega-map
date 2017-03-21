const L = require('leaflet');
const leafletKnn = require('leaflet-knn');
const emitter = require('../mediator');
const mapLayers = require('./layers');
const Layer = require('./layer');

const _  = require('../util');

L.Icon.Default.imagePath = './images';

const Map = function(data) {
  this.zoom = data.zoom || 7;
  this.mapId = data.mapId || 'map';
  this.offices = data.offices;
  this.bounds = data.bounds;
  this.initialOffice = data.initialOffice;
  this.scroll = data.scroll;
  this.layers = data.layers;

  this.index = leafletKnn( L.geoJson(this.offices.getOffices()) );
  this.fullExtent = _.create('button', ['tt-w', 'zoom-to-full-extent', 'leaflet-control-roy'], document.body);
  this.fullExtent.setAttribute('data-tt', 'Zoom to full extent');
  this.nearest = _.create('button', ['find-nearest', 'tt-w', 'leaflet-control-roy'], document.body);
  this.nearest.setAttribute('data-tt', 'Find nearest offices');
  this.imgLocate = _.create('img', '', this.nearest);
  this.imgLocate.setAttribute('src', './svg/current-location.svg');
  this.imgLocate.setAttribute('alt', 'Icon representing your current location');
  this.imgExtent = _.create('img', '', this.fullExtent);
  this.imgExtent.setAttribute('src', './svg/full-extent.svg');
  this.imgExtent.setAttribute('alt', 'Icon representing zoom to full extent');

  this.createMap.call(this);

  emitter.on('office:selected', mapLayers.flyToOffice);
  emitter.on('detail:hide', this.panMap.bind(this));
  emitter.on('detail:show', this.panMap.bind(this));
  this.fullExtent.addEventListener('click', this.zoomToFullExtent.bind(this));
  this.nearest.addEventListener('click', this.getLocation.bind(this));
  this.map.on('click', this.blurInput.bind(this));
  this.map.on('locationfound', this.findNearest.bind(this));
};

module.exports = Map;

Map.prototype.getLocation = function() {
  this.nearest.classList.add('loading');
  this.imgLocate.setAttribute('src', './svg/loading.svg');
  this.map.locate();
}

Map.prototype.panMap = function(distance) {
  this.map.panBy([distance, 0]);
}

Map.prototype.blurInput = function() {
  emitter.emit('blur:input');
}

Map.prototype.zoomToFullExtent = function() {
  this.map.flyToBounds(mapLayers.getBounds());
  emitter.emit('zoom:fullextent');
}

Map.prototype.createMap = function() {
  const mapOptions = {
    zoom: this.zoom,
    scrollWheelZoom: this.scroll,
    zoomControl: false,
    layers: [mapLayers.baseLayers['ESRI National Geographic']]
  };

  const refuges = new Layer({
    offices: this.offices,
    type: 'National Wildlife Refuge'
  });

  console.log(refuges);

  this.map = L.map(this.mapId, mapOptions);
  if (this.bounds) this.map.fitBounds(this.bounds);

  mapLayers.init(this.offices.getOffices(), this.layers, this.map);
  if (this.initialOffice) mapLayers.flyToOffice( this.initialOffice );

  new L.Control.Zoom({ position: 'bottomright' }).addTo(this.map);
}

Map.prototype.findNearest = function(e) {
  L.popup().setLatLng(e.latlng).setContent('Your Current Location').openOn(this.map);
  const nearest = this.index.nearest(e.latlng, 10);
  this.nearest.classList.remove('loading');
  this.imgLocate.setAttribute('src', './svg/current-location.svg');
  emitter.emit('found:nearest', nearest);
}

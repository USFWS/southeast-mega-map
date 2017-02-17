const emitter = require('./mediator');
const _ = require('./util');

const Switcher = function(data) {
  this.view = data.view;
  this.textViewContainer = data.textViewContainer;
  this.mapViewContainer = data.mapViewContainer;

  if (this.view === 'text') this.showText();

  this.container = _.create('div', 'layer-switcher', document.body);
  this.textButton = _.create('button', 'layer-switcher-button text-view-button', this.container);
  this.mapButton = _.create('button', 'layer-switcher-button map-view-button', this.container);
  this.textButton.innerHTML = 'List View';
  this.mapButton.innerHTML = 'Map View';

  this.textButton.addEventListener('click', this.showText.bind(this));
  this.mapButton.addEventListener('click', this.showMap.bind(this));
};

module.exports = Switcher;

Switcher.prototype.showText = function() {
  this.textViewContainer.classList.add('active');
  this.view = 'text';
  emitter.emit('view:changed', 'text');
}

Switcher.prototype.showMap = function() {
  this.textViewContainer.classList.remove('active');
  this.view = 'map';
  emitter.emit('view:changed', 'map');
}

Switcher.prototype.toggleView = function() {
  if (this.view === 'map') this.showText();
  else this.showMap();
}

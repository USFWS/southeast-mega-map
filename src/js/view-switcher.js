(function () {
  'use strict';

  var emitter = require('./mediator');
  var _ = require('./util');

  var textView = document.querySelector('.office-list');
  var mapView = document.querySelector('#map');

  var opts = {};
  var currentView;

  function init() {
    getCurrentView();
    opts.container = _.create('div', 'layer-switcher', document.body);
    opts.textButton = _.create('button', 'layer-switcher-button text-view-button', opts.container);
    opts.mapButton = _.create('button', 'layer-switcher-button map-view-button', opts.container);
    opts.textButton.innerHTML = 'List View';
    opts.mapButton.innerHTML = 'Map View';

    opts.textButton.addEventListener('click', showText);
    opts.mapButton.addEventListener('click', showMap);
  }

  function showText() {
    _.addClass(textView, 'active');
    currentView = 'text';
    emitter.emit('view:changed', 'text');
  }

  function showMap() {
    _.removeClass(textView, 'active');
    currentView = 'map';
    emitter.emit('view:changed', 'map');
  }

  function toggleView() {
    if (currentView === 'map') showText();
    else showMap();
  }

  function getCurrentView() {
    currentView = ( _.hasClass(mapView, 'active') ) ? 'map' : 'text';
  }

  module.exports.init = init;
  module.exports.toggleView = toggleView;
})();

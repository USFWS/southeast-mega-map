(function () {
  'use strict';

  var _ = require('./util');
  var emitter = require('./mediator');
  var templates = {
    about: require('../templates/about.jade')
  };

  var opts = {},
      modal = false;

  function init() {
    opts.about = _.create('button', ['about-map', 'leaflet-control-roy', 'tt-w'], document.body);
    opts.about.setAttribute('data-tt', 'About this map');
    opts.imgAbout = _.create('img', '', opts.about);
    opts.imgAbout.setAttribute('src', './svg/help.svg');
    opts.imgAbout.setAttribute('alt', 'Icon representing help');
    opts.modal = _.create('aside', 'about-modal', document.body);
    opts.close = _.create('button', 'modal-close', opts.modal);
    opts.close.innerHTML = '&times;';
    opts.aboutContent = _.create('section', 'about-content', opts.modal);
    opts.aboutContent.innerHTML = templates.about();

    registerHandlers();
  }

  function registerHandlers() {
    opts.about.addEventListener('click', toggleModal);
    opts.close.addEventListener('click', hideModal);
    document.body.addEventListener('keyup', keyHandler);
  }

  function keyHandler(e) {
    // Close the modal if the user hits escape
    if (e.which === 27 && modal) hideModal();
  }

  function showModal() {
    modal = true;
    _.addClass(opts.modal, 'active');
    opts.close.focus();
    emitter.emit('modal:open');
  }

  function hideModal() {
    modal = false;
    _.removeClass(opts.modal, 'active');
    emitter.emit('modal:close');
  }

  function toggleModal() {
    if (modal) hideModal();
    else showModal();
  }

  module.exports.init = init;
})();

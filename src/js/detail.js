(function () {
  'use strict';

  var emitter = require('./mediator');
  var OfficeService = require('./offices');
  var template = require('../templates/detail.jade');
  var _ = require('./util')._;

  var opts = {},
      active;

  function init() {
    createDetail();
    registerHandlers();
  }

  function createDetail() {
    opts.container = document.createElement('aside');
    opts.container.classList.add('detail-container');
    opts.content = document.createElement('section');
    opts.content.classList.add('detail-content');
    opts.close = document.createElement('button');
    opts.close.innerHTML = '&#9650;';
    opts.close.classList.add('detail-toggle');
    opts.container.appendChild(opts.content);
    opts.container.appendChild(opts.close);
    document.body.appendChild(opts.container);
  }

  function addCloseButton() {
    opts.close = document.createElement('button');
    opts.close.innerHTML = 'Close';
    opts.close.classList.add('detail-toggle');
    opts.output.appendChild(opts.close);
  }

  function registerHandlers() {
    opts.container.addEventListener('click', blurInput);
    opts.close.addEventListener('click', toggleDetail);
    emitter.on('office:selected', renderOffice);
    emitter.on('marker:click', renderOffice);
    emitter.on('autocomplete:keyup', hideDetail);
    emitter.on('found:office', renderOffice);
    emitter.on('offices:random', renderOffice);
    emitter.on('zoom:fullextent', hideDetail);
  }

  function blurInput() {
    emitter.emit('blur:input');
  }

  function showDetail() {
    if (!active)
      emitter.emit('detail:show', -200);
    active = true;
    opts.close.innerHTML = '&#9660;';
    opts.container.classList.add('active');
  }

  function hideDetail() {
    if (active)
      emitter.emit('detail:hide', 200);
    active = false;
    opts.close.innerHTML = '&#9650;';
    opts.container.classList.remove('active');
  }

  function toggleDetail() {
    var eventName = (active) ? 'detail:hide' : 'detail:show';
    var arrow = (active) ? '&#9650;' : '&#9660;';
    var distance = (active) ? 200 : -200;
    opts.close.innerHTML = arrow;
    opts.container.classList.toggle('active');
    active = !active;
    emitter.emit(eventName, distance);
  }

  function renderOffice(office) {
    opts.content.innerHTML = template({ office: office.properties });
    showDetail();
    // emitter.emit('cache:office', office);
  }

  exports.init = init;
  exports.toggle = toggleDetail;
  exports.show = showDetail;
  exports.hide = hideDetail;

})();

(function () {
  'use strict';

  var emitter = require('./mediator');
  var OfficeService = require('./offices');
  var template = require('../templates/detail.jade');
  var nearestTemplate = require('../templates/nearest.jade');
  var querystring = require('./querystring');
  var _ = require('./util')._;
  var domUtil = require('./domUtil');

  var opts = {}, active;

  function init() {
    createDetail();
    registerHandlers();
  }

  function createDetail() {
    opts.container = domUtil.create('aside', 'detail-container', document.body);
    opts.content = domUtil.create('section', 'detail-content', opts.container);
    opts.nearest = domUtil.create('section', 'detail-nearest', opts.content);
    opts.close = domUtil.create('button', 'detail-toggle', opts.container);
    opts.close.innerHTML = '&#9650;';
  }

  function registerHandlers() {
    opts.container.addEventListener('click', blurInput);
    opts.close.addEventListener('click', toggleDetail);
    opts.nearest.addEventListener('click', delegatedOfficeLink);
    emitter.on('office:selected', renderOffice);
    emitter.on('marker:click', renderOffice);
    emitter.on('autocomplete:keyup', hideDetail);
    emitter.on('found:office', renderOffice);
    emitter.on('offices:random', renderOffice);
    emitter.on('zoom:fullextent', hideDetail);
    emitter.on('found:nearest', renderNearest);
  }

  function delegatedOfficeLink (e) {
    e.preventDefault();

    if (e.target.nodeName === 'A'){
      var officeName = querystring.stringify(e.srcElement.href);
      var office = OfficeService.getOffice(officeName);
      renderOffice(office);
    }
  }

  function blurInput() {
    emitter.emit('blur:input');
  }

  function showDetail() {
    if (!active)
      emitter.emit('detail:show', -200);
    active = true;
    opts.close.innerHTML = '&#9660;';
    domUtil.addClass(opts.container, 'active');
  }

  function hideDetail() {
    if (active)
      emitter.emit('detail:hide', 200);
    active = false;
    opts.close.innerHTML = '&#9650;';
    domUtil.removeClass(opts.container, 'active');
  }

  function toggleDetail() {
    var eventName = (active) ? 'detail:hide' : 'detail:show';
    var distance = (active) ? 200 : -200;
    opts.close.innerHTML = (active) ? '&#9650;' : '&#9660;';
    domUtil.toggleClass('active');
    active = !active;
    emitter.emit(eventName, distance);
  }

  function renderOffice(office) {
    opts.content.innerHTML = template({ office: office.properties });
    showDetail();
  }

  function renderNearest(nearest) {
    opts.nearest.innerHTML = nearestTemplate({ nearest: nearest });
    showDetail();
  }

  exports.init = init;
  exports.toggle = toggleDetail;
  exports.show = showDetail;
  exports.hide = hideDetail;

})();

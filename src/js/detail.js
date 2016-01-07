(function () {
  'use strict';

  var emitter = require('./mediator');
  var OfficeService = require('./offices');
  var template = require('../templates/detail.hbs');
  var _ = require('./util')._;

  var opts, active;

  function init(options) {
    opts = _.defaults({}, options);
    registerHandlers();
  }

  function registerHandlers() {
    emitter.on('office:selected', renderOffice);
    emitter.on('marker:click', renderOffice);
  }

  function showDetail() {
    active = true;
    opts.output.classList.add('active');
    emitter.emit('detail:show', opts.output);
  }

  function hideDetail() {
    active = false;
    opts.output.classList.remove('active');
    emitter.emit('detail:hide', opts.output);
  }

  function toggleDetail() {
    var eventName = (active) ? 'detail:hide' : 'detail:show';
    opts.output.classList.toggle('active');
    active = !active;
    emitter.emit(eventName, opts.output);
  }

  function renderOffice(office) {
    showDetail();
    opts.output.innerHTML = template(office.properties);
  }

  exports.init = init;
  exports.toggle = toggleDetail;
  exports.show = showDetail;
  exports.hide = hideDetail;

})();

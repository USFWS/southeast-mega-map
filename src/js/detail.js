(function () {
  'use strict';

  var emitter = require('./mediator');
  var OfficeService = require('./offices');
  var template = require('../templates/detail.hbs');
  var _ = {
    defaults: require('lodash.defaults')
  };

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
    opts.output.classList.remote('active');
    emitter.emit('detail:hide', opts.output);
  }

  function toggleDetail() {
    if (active)
      hideDetail();
    else
      showDetail();
    active = !active;
  }

  function renderOffice(office) {
    showDetail();
    opts.output.innerHTML = template(office.properties);
  }

  exports.init = init;

})();

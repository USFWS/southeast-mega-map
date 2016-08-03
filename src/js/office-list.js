(function () {
  'use strict';

  var emitter = require('./mediator');
  var template = require('../templates/li.jade');
  var list = document.querySelector('.office-list');

  function init() {
    registerHandlers();
  }

  function registerHandlers() {
    emitter.on('autocomplete:results', render);
  }

  function render(offices) {
    var data = offices.map(function (office) { return { properties: office } });
    list.innerHTML = template({ offices: data });
  }

  module.exports.init = init;
})();

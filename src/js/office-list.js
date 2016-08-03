(function () {
  'use strict';

  var emitter = require('./mediator');
  var template = require('../templates/li.jade');
  var list = document.querySelector('.office-list');

  function init() {
    registerHandlers();
  }

  function registerHandlers() {
    emitter.on('autocomplete:results', resultsHandler);
    emitter.on('autocomplete:empty', emptyHandler);
  }

  function resultsHandler(offices) {
    var data = offices.map(function (office) { return { properties: office } });
    render(data);
  }

  function emptyHandler(offices) {
    render(offices);
  }

  function render(offices) {
    list.innerHTML = template({ offices: offices });
  }

  module.exports.init = init;
})();

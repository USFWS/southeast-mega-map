(function () {
  'use strict';

  var emitter = require('./mediator');
  var _ = require('./util');
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
    offices = _.map(offices, function (office) {
      office.properties.icon = getIconPath(office.properties);
      return office;
    });
    list.innerHTML = template({ offices: offices });
  }

  function getIconPath(office) {
    var path = ['./svg/'],
        alt;
    switch (office.type) {
      case 'National Wildlife Refuge':
        path.push('blue-goose.svg');
        alt = 'Official Logo of the National Wildlife Refuge System';
        break;
      case 'National Fish Hatchery':
        path.push('fisheries.svg');
        alt = 'Logo for the Fisheries program';
        break;
      default:
        path.push('building.svg');
        alt = 'Icon representing a Field Station';
        break;
     }
     return {
       src: path.join(''),
       alt: alt
     };
  }

  module.exports.init = init;
})();

(function () {
  'use strict';

  var request = require('superagent');
  var emitter = require('./mediator');
  var _ = {
    find: require('lodash.find')
  };

  var offices;

  function init() {
    request
      .get('./js/offices.json')
      .set('Accept', 'application/json')
      .end(function (err, res) {
        offices = res.body;
        emitter.emit('offices:loaded');
      });
  }

  function getOffices() {
    return offices;
  }

  function getOffice(officeName) {
    return _.find(offices.features, function (office) {
      return office.properties.name.toLowerCase() === officeName.toLowerCase();
    });
  }

  exports.getOffices = getOffices;
  exports.getOffice = getOffice;
  exports.init = init;

})();

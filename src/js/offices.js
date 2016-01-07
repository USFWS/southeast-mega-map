(function () {
  'use strict';

  var xhr = require('xhr');
  var emitter = require('./mediator');
  var _ = require('./util')._;

  var offices;

  function init() {
    xhr.get('./data/offices.json', function (err, res) {
      offices = JSON.parse(res.body);
      emitter.emit('offices:loaded', offices);
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

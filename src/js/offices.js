(function () {
  'use strict';

  var xhr = require('xhr');
  var emitter = require('./mediator');
  var _ = require('./util')._;

  var offices;

  function init() {
    downloadOffices();
  }

  function downloadOffices() {
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

  function getRandomOffice() {
    var list = offices.features;
    var randomOffice = list[Math.floor(Math.random()*list.length)];
    // ToDo: Functionality to call this function recursively if the random
    //       office is not open to the public?  Needs to be added to dataset.
    emitter.emit('offices:random', randomOffice);
  }

  exports.getOffices = getOffices;
  exports.getOffice = getOffice;
  exports.getRandomOffice = getRandomOffice;
  exports.init = init;

})();

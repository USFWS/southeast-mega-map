(function () {
  'use strict';

  var xhr = require('xhr');
  var L = require('leaflet');
  var emitter = require('./mediator');
  var _ = require('./util');

  var offices;

  function init(cb) {
    xhr.get('./data/offices.json', function (err, res) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb(new Error('Could not download offices.'));
      offices = JSON.parse(res.body);
      return cb(null, offices);
    });
  }

  function getBounds() {
    return L.geoJson(offices).getBounds();
  }

  function getOffices() {
    return offices;
  }

  function getOffice(officeName) {
    return _.find(offices.features, function (office) {
      var name = normalizeOfficeName(office.properties.name);
      return name.toLowerCase() === officeName.toLowerCase();
    });
  }

  // Remove special characters from office name
  function normalizeOfficeName(officeName) {
    return officeName.replace(/[^a-zA-Z ]+/g, '');
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
  exports.normalizeOfficeName = normalizeOfficeName;
  exports.getBounds = getBounds;
  exports.init = init;

})();

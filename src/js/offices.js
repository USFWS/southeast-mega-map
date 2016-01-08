(function () {
  'use strict';

  var xhr = require('xhr');
  var store = require('store');
  var emitter = require('./mediator');
  var _ = require('./util')._;

  var offices;

  function init() {
    getCache();
    xhr.get('./data/offices.json', function (err, res) {
      offices = JSON.parse(res.body);
      emitter.emit('offices:loaded', offices);
    });
    registerHandlers();
  }

  function registerHandlers() {
    console.log("REGISTER OFFICES");
    emitter.on('cache:office', setCache);
  }

  function setCache(office) {
    store.set('office', JSON.stringify(office));
  }

  function getCache() {
    var office = store.get('office');
    emitter.emit('found:office', JSON.parse(office));
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

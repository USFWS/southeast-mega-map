(function () {
  'use strict';
  var test = require('tape');
  var StateService = require('../src/js/StateService');

  var geojson = require('../src/data/states.json');
  var States = new StateService(geojson);

  test('getBounds should take a single state', function (t) {
    // t.plan(1);
    var state = { state: 'Alabama' };
    var bounds = States.getBounds(state, 'NAME');

  });

  test('getBounds should take an array of states', function(t) {
    // t.plan(1);
    var states = { state: ['Alabama', 'Mississippi'] };
    var bounds = States.getBounds(states);
  });

  test('getBounds should return null for a falsy value', function (t) {
    // t.plan(1);
    var bounds = States.getBounds();
  });
})();

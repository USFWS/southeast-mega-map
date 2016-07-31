(function () {
  'use strict';

  var xhr = require('xhr');
  var madison = require('madison');
  var L = require('leaflet');
  var _ = require('./util');

  var states = null;

  function init(cb) {
    xhr.get('./data/states.json', function (err, res) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb(new Error('Could not download offices.'));
      states = JSON.parse(res.body);
      return cb(null, states);
    });
  }

  function getBounds(stateList, key) {
    if (!states) return null;

    var layer, name, state;

    stateList = normalizeStateList(stateList);

    layer = L.geoJson(states, {
      filter: function(feature, layer) {
        name = feature.properties[key];
        state = (name.length === 2) ? madison.getStateNameSync(name).toLowerCase() : name.toLowerCase();
        return _.includes(stateList, state);
      }
    });
    return layer.getBounds();
  }

  // Send back an array of lowercase state names
  function normalizeStateList(stateList) {
    if (!stateList) return null;
    var normalized = [];

    if (typeof stateList === 'string') normalized.push( stateList.toLowerCase() );
    else normalized = stateList;

    return normalized.map(function(state) { return getStateName(state); });
  }

  function getStateName(state) {
    if (state.length === 2) return madison.getStateNameSync(state).toLowerCase();
    else return state.toLowerCase();
  }

  module.exports = {
    init: init,
    getBounds: getBounds
  };

})();

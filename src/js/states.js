const madison = require('madison');
const L = require('leaflet');
const _ = require('./util');

const StateService = function(data) {
  this.states = data;
}

module.exports = StateService

StateService.prototype.getBounds = function(stateList, key) {
  const list = this.normalizeStateList(stateList);

  const layer = L.geoJson(this.states, {
    filter: function(feature, layer) {
      const name = feature.properties[key];
      const state = (name.length === 2) ? madison.getStateNameSync(name) : name;
      return _.includes(list, state.toLowerCase());
    }
  });
  return layer.getBounds();
}

StateService.prototype.getStateName = function(state) {
  if (state.length === 2) return madison.getStateNameSync(state).toLowerCase();
  else return state.toLowerCase();
}

// Send back an array of lowercase state names
StateService.prototype.normalizeStateList = function(stateList) {
  if (!stateList) return null;
  const self = this;
  let list = [];
  if (typeof stateList === 'string') list.push(stateList);
  else list = [...stateList];
  return list.map(function(state) { return this.getStateName(state); });
}

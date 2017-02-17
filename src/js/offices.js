const L = require('leaflet');
const lunr = require('lunr');
const objectAssign = require('object-assign');
const emitter = require('./mediator');
const _ = require('./util');

let offices;

const OfficeService = function(data) {
  if (!data) return new Error('You must provide a geojson object.');
  this.offices = data;
  this.bounds = L.geoJson(data).getBounds();
  this.index = lunr(function() {
    this.field('name', { boost: 10 });
    this.field('type');
    this.field('program');
    this.field('city');
    this.field('state');
    this.field('zip');
    this.field('narrative', { boost: 5 });
    this.ref('href');
  });

  const index = this.index;

  this.offices.features.forEach(function(office, i) {
    const theOffice = objectAssign({ href: i }, office.properties);
    index.add(theOffice);
  });
}

module.exports = OfficeService;

OfficeService.prototype.getBounds = function() {
  return this.bounds;
}

OfficeService.prototype.getOffices = function() {
  return this.offices;
}

OfficeService.prototype.search = function(query) {
  const self = this;
  return this.index
    .search(query)
    .sort(sortByScore)
    .map(result => self.offices.features[result.ref]);
}

OfficeService.prototype.getOffice = function(officeName) {
  return offices.features.find(office => {
    const name = normalizeOfficeName(office.properties.name);
    return name.toLowerCase() === officeName.toLowerCase();
  });
}

// Remove special characters from office name
OfficeService.prototype.normalizeOfficeName = function(officeName) {
  return officeName.replace(/[^a-zA-Z ]+/g, '');
}

OfficeService.prototype.getRandomOffice = function() {
  const list = offices.features;
  const randomOffice = list[Math.floor(Math.random()*list.length)];
  // ToDo: Functionality to call this function recursively if the random
  //       office is not open to the public?  Needs to be added to dataset.
  emitter.emit('offices:random', randomOffice);
}

function sortByScore(a, b) {
  if (a.score > b.score) return -1;
  if (a.score < b.score) return 1;
  return 0;
}

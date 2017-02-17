const emitter = require('./mediator');
const objectAssign = require('object-assign');
const template = require('../templates/li.pug');

const OfficeList = function(data) {
  this.list = data.list;
  this.offices = data.offices;

  emitter.on('autocomplete:results', this.render.bind(this));
  emitter.on('autocomplete:empty', this.emptyHandler.bind(this));
};

module.exports = OfficeList;

OfficeList.prototype.emptyHandler = function(offices) {
  this.render(this.offices.getOffices().features);
}

OfficeList.prototype.render = function(offices) {
  const data = offices
    .map(o => o.properties)
    .map(o => objectAssign({icon: getIconPath(o)}, o));

  this.list.innerHTML = template({ offices: data });
}

function getIconPath(office) {
  switch (office.type) {
    case 'National Wildlife Refuge':
      return {
        src: './svg/blue-goose.svg',
        alt: 'Official Logo of the National Wildlife Refuge System'
      }
    case 'National Fish Hatchery':
      return {
        src: './svg/fisheries.svg',
        alt: 'Logo for the Fisheries program'
      }
    default:
      return {
        src: './svg/building.svg',
        alt: 'Icon representing a Field Station'
      }
    }
}

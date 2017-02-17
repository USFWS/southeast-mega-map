const L = require('leaflet');

const blueGoose = L.icon({
  iconUrl: './svg/blue-goose.svg',
  iconSize: [70, 90],
  popupAnchor: [5, -17]
});

const office = L.icon({
  iconUrl: './svg/building.svg',
  iconSize: [70, 50],
  popupAnchor: [0, -20]
});

const fisheries = L.icon({
  iconUrl: './svg/fisheries.svg',
  iconSize: [70, 50],
  popupAnchor: [7, -25]
});

module.exports = {
  blueGoose,
  office,
  fisheries
};

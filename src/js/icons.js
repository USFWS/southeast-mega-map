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

function getIcon(type) {
  switch (type) {
    case 'National Wildlife Refuge':
      return {
        alt: 'Official Logo of the National Wildlife Refuge System',
        icon: blueGoose
      };
    case 'National Fish Hatchery':
      return {
        alt: 'Official Logo of America\'s Fisheries',
        icon: fisheries
      };
    default:
      return {
        alt: 'A generic office building icon',
        icon: office
      };
    }
}

module.exports = {
  blueGoose,
  office,
  fisheries,
  getIcon
};

(function () {
  'use strict';

  var L = require('leaflet');

  module.exports = {
    "State Boundaries": L.tileLayer.wms('https://maps.bts.dot.gov/services/services/NTAD/States/MapServer/WmsServer?', {
      format: 'image/png',
      transparent: true,
      layers: '0',
      attribution: '<a href="http://osav.usdot.opendata.arcgis.com/datasets/34f8a046fef944f39d8a65004a431a1f_0">Dept. of Transportation</a>'
    }),
    "Refuge Boundaries": L.tileLayer.wms('https://gis.fws.gov/arcgis/services/FWS_Refuge_Boundaries/MapServer/WMSServer?', {
      format: 'image/png',
      layers: '0',
      transparent: true,
      attribution: '<a href="https://www.fws.gov/gis/data/CadastralDB/index_cadastral.html">U.S. Fish and Wildlife Service</a>'
    }),
    "114th Congressional Districts": L.tileLayer.wms('https://www.sciencebase.gov/arcgis/services/Catalog/57a0e84fe4b006cb4554a439/MapServer/WMSServer?', {
      format: 'image/png',
      layers: '0',
      transparent: true,
      attribution: '<a href="https://www.census.gov/geo/maps-data/data/cbf/cbf_cds.html">Census Bureau</a>'
    }),
    "Ducks Unlimited Flyways": L.tileLayer.wms('https://www.sciencebase.gov/arcgis/services/Catalog/57a102c1e4b006cb4554a4d3/MapServer/WMSServer?', {
      format: 'image/png',
      layers: '0',
      transparent: true,
      opacity: .5,
      attribution: '<a href="http://www.ducks.org/conservation/gis/gis-spatial-data-download/page4">Ducks Unlimited</a>'
    })
  };

})();

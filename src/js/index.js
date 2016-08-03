(function() {
  'use strict';

  var xhr = require('xhr');
  var qs = require('query-string');
  var parallel = require('async/parallel');

  var autocomplete = require('./autocomplete');
  var officeList = require('./office-list');
  var toolbar = require('./toolbar');
  var detail = require('./detail');
  var emitter = require('./mediator');
  var map = require('./map/index.js');
  var OfficeService = require('./offices');
  var StateService = require('./states');

  var params = qs.parse(location.search);

  init();

  function init() {
    var tasks = [OfficeService.init];
    if (params.state) tasks.push( StateService.init );

    parallel(tasks, displayOffices);
  }

  function displayOffices(err, data) {
    if (err) console.log(err);
    var offices = data[0];
    var initOnOffice = null;

    var bounds = (params.state) ? StateService.getBounds(params.state, 'NAME') : OfficeService.getBounds();

    var mapOptions = {
      bounds: bounds,
      data: offices
    };
    if (params.layers) mapOptions.layers = normalizeParams(params.layers);
    if (params.office) mapOptions.initOnOffice = normalizeParams(params.office)[0];

    map.init(mapOptions);
    officeList.init();

    autocomplete.init({
      data: offices.features,
      input: document.querySelector('.autocomplete-input'),
      output: document.querySelector('.autocomplete-results')
    });

    detail.init({
      output: document.querySelector('.autocomplete-detail')
    });

    if (params.detail === 'true') detail.show();

    toolbar.init();
  }

  function normalizeParams(params) {
    var normalized = [];
    if (typeof params === 'string') normalized.push(params);
    else normalized = params;
    return normalized.map(function (p) { return p.toLowerCase(); });
  }
})();

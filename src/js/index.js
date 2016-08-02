(function() {
  'use strict';

  var xhr = require('xhr');
  var qs = require('query-string');
  var parallel = require('async/parallel');

  var autocomplete = require('./autocomplete');
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

    var bounds = (params.state) ? StateService.getBounds(params.state, 'NAME') : OfficeService.getBounds();

    var mapOptions = {
      bounds: bounds,
      data: offices
    };
    if (params.layers) mapOptions.layers = normalizeLayers(params.layers);

    map.init(mapOptions);

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

  function normalizeLayers(layers) {
    var normalized = [];
    if (typeof layers === 'string') normalized.push(layers);
    else normalized = layers;
    return normalized.map(function (l) { return l.toLowerCase(); });
  }
})();

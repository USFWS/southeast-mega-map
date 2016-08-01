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
    var tasks = [OfficeService.init ];
    if (params.state) tasks.push( StateService.init );

    parallel(tasks, displayOffices);
  }

  function displayOffices(err, data) {
    if (err) console.log(err);
    var offices = data[0];

    var bounds = (data.length > 1) ? StateService.getBounds(params.state, 'NAME') : OfficeService.getBounds();

    map.init({
      bounds: bounds,
      data: offices
    });

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

  // function displayOffices(err, data) {
  //   if (err) console.log(err);
  //
  //   var Offices = data[0],
  //       States,
  //       options = {
  //         data: Offices.geojson
  //       };
  //
  //   if (data[1])  States = data[1];
  //
  //   if (params.state) options.bounds = States.getBounds(params.state, 'NAME');
  //   else options.bounds = Offices.getBounds();
  //
  //   map.init(options);
  //
  //   autocomplete.init({
  //     data: Offices.forList(),
  //     input: document.querySelector('.autocomplete-input'),
  //     output: document.querySelector('.autocomplete-results')
  //   });
  //
  //   detail.init({
  //     output: document.querySelector('.autocomplete-detail')
  //   });
  //
  //   toolbar.init();
  // }
  //
  // function fetchData(url, Model, cb) {
  //   xhr.get(url, function(err, res, body) {
  //     if (err) cb(err);
  //     if (res.statusCode !== 200) cb(new Error('Could not download data.'));
  //     cb(null, new Model( JSON.parse(res.body) ));
  //   });
  // }

})();

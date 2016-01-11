(function() {
  'use strict';

  var autocomplete = require('./autocomplete');
  var toolbar = require('./toolbar');
  var detail = require('./detail');
  var emitter = require('./mediator');
  var OfficeService = require('./offices');
  var map = require('./map');

  OfficeService.init();

  emitter.on('offices:loaded', function (offices) {

    map.init({
      center: [31.6817285,-77.4474468],
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

    toolbar.init();

    // OfficeService.getRandomOffice();
  });

})();

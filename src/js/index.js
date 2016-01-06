(function() {
  'use strict';

  var autocomplete = require('./autocomplete');
  var detail = require('./detail');
  var emitter = require('./mediator');
  var OfficeService = require('./offices');
  var map = require('./map');
  var Handlebars = require('hbsfy/runtime');

  Handlebars.registerHelper('slugify', function (component, options) {
    return component.replace(/[^\w\s]+/gi, '').replace(/ +/gi, '-').toLowerCase();
  });

  OfficeService.init();

  emitter.on('offices:loaded', function () {
    var offices = OfficeService.getOffices();
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
  });

})();

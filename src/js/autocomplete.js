(function() {
  'use strict';

  var lunr = require('lunr');
  var emitter = require('./mediator');
  var _ = require('./util')._;

  var querystring = require('./querystring');
  var OfficeService = require('./offices');
  var template = require('../templates/autocomplete.jade');

  var opts, index;
  var defaults = {
    minLength: 0
  };

  function init(options) {
    opts = _.defaults({}, options, defaults);

    if (!opts.data) throw 'You must provide an array of offices';
    if (!opts.input) throw 'You must provide an html input';
    if (!opts.output) throw 'You must provide a list to append the results';

    registerHandlers();
    createIndex();
    seedIndex();
  }

  function registerHandlers() {
    opts.output.addEventListener('click', delegatedOfficeLink);
    opts.input.addEventListener('keyup', inputKeyup);
    emitter.on('marker:click', updateInputValue);
  }

  function updateInputValue(office) {
    opts.input.value = office.properties.name;
  }

  function delegatedOfficeLink (e) {
    e.preventDefault();

    // ToDo:
    // parse anchor query string for office name
    // get office by name w/ OfficeService
    // emit event w/office
    if (e.target.nodeName === 'A'){
      var officeName = querystring.stringify(e.srcElement.href);
      var office = OfficeService.getOffice(officeName);
      opts.output.innerHTML = '';
      opts.input.value = e.srcElement.textContent;
      emitter.emit('office:selected', office);
    }
  }

  function inputKeyup() {
    emitter.emit('autocomplete:keyup');
    if (opts.input.value.length < opts.minLength) return;
    search(opts.input.value);
  }

  function createIndex () {
    index = lunr(function() {
      this.field('name', { boost: 10 });
      this.field('type', { boost: 3 });
      this.field('program');
      this.field('address');
      this.field('city', { boost: 5 });
      this.field('state', { boost: 5 });
      this.field('zip');
      this.ref('id');
    });
  }

  function seedIndex () {
    opts.data.forEach(function (obj, i) {
      obj.properties.id = i;
      index.add(obj.properties);
    });
  }

  function search (query) {
    var hits = index.search(query);
    var results = [];

    // Need to sort the hits based on lunrjs score
    hits.forEach(function (hit, i) {
      results.push(opts.data[hit.ref].properties);
    });

    render(results);
  }

  function render(data) {
    data.forEach(function (office) {
      office.slug = '?q=' + _.slugify(office.name).toLowerCase();
    });
    opts.output.innerHTML = template({ offices: data });
  }

  module.exports.init = init;

})();

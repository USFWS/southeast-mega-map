(function() {
  'use strict';

  var lunr = require('lunr');
  var emitter = require('./mediator');
  var _ = require('./util');

  var querystring = require('./querystring');
  var template = require('../templates/autocomplete.jade');
  var OfficeService = require('./offices');

  var opts, index;
  var defaults = {
    minLength: 2
  };

  function init(options) {
    opts = _.defaults({}, options, defaults);
    if (!opts.data) throw new Error('You must provide an array of offices');

    createElements();
    registerHandlers();
    createIndex();
    seedIndex();
  }

  function createElements() {
    opts.container = _.create('div', 'autocomplete-widget', document.body);
    opts.form = _.create('form', 'autocomplete-form', opts.container);
    opts.label = _.create('label', '', opts.form);
    opts.label.innerHTML = 'Search:';
    opts.input = _.create('input', 'autocomplete-input', opts.form);
    opts.output = _.create('ul', 'autocomplete-results', opts.container);
  }

  function registerHandlers() {
    opts.output.addEventListener('click', delegatedOfficeLink);
    opts.form.addEventListener('submit', function (e) { e.preventDefault(); });
    opts.input.addEventListener('keyup', inputKeyup);
    opts.input.addEventListener('focus', focusInput);
    emitter.on('marker:click', updateInputValue);
    emitter.on('blur:input', blurInput);
    opts.input.focus();
  }

  function updateInputValue(office) {
    opts.input.value = office.properties.name;
  }

  function focusInput() {
    _.addClass(opts.container, 'active');
    opts.input.setAttribute('placeholder', 'Search');
  }

  function blurInput() {
    _.removeClass(opts.container, 'active');
    opts.input.setAttribute('placeholder', '');
  }

  function delegatedOfficeLink (e) {
    e.preventDefault();

    // ToDo:
    // parse anchor query string for office name
    // get office by name w/ OfficeService
    // emit event w/office
    if (e.target.nodeName === 'A') {
      var officeName = querystring.stringify(e.target.search);
      var office = OfficeService.getOffice(officeName);
      opts.output.innerHTML = '';
      opts.input.value = e.target.textContent;
      emitter.emit('office:selected', office);
      blurInput();
    }
  }

  function inputKeyup() {
    emitter.emit('autocomplete:keyup');
    if (opts.input.value.length === 0) {
      emitter.emit('autocomplete:empty', opts.data);
      opts.output.innerHTML = '';
      return;
    } else if (opts.input.value.length < opts.minLength) return;
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
    emitter.emit('autocomplete:results', results);
  }

  function render(data) {
    opts.output.innerHTML = template({ offices: data });
  }

  module.exports.init = init;

})();

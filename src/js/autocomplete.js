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

    createElements();
    registerHandlers();
    createIndex();
    seedIndex();
  }

  function createElements() {
    opts.container = document.createElement('div');
    opts.container.classList.add('autocomplete-widget');
    opts.form = document.createElement('form');
    opts.form.classList.add('autocomplete-form');
    opts.label = document.createElement('label');
    opts.label.innerHTML = 'Search:';
    opts.input = document.createElement('input');
    opts.input.classList.add('autocomplete-input');
    opts.output = document.createElement('ul');
    opts.output.classList.add('autocomplete-results');
    opts.form.appendChild(opts.label);
    opts.form.appendChild(opts.input);
    opts.container.appendChild(opts.form);
    opts.container.appendChild(opts.output);
    document.body.appendChild(opts.container);
  }

  function registerHandlers() {
    opts.output.addEventListener('click', delegatedOfficeLink);
    opts.input.addEventListener('keyup', inputKeyup);
    opts.input.addEventListener('focus', focusInput);
    emitter.on('marker:click', updateInputValue);
    emitter.on('blur:input', blurInput);
  }

  function updateInputValue(office) {
    opts.input.value = office.properties.name;
  }

  function focusInput() {
    opts.container.classList.add('active');
    opts.input.setAttribute('placeholder', 'Search');
  }

  function blurInput() {
    opts.container.classList.remove('active');
    opts.input.setAttribute('placeholder', '');
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
      blurInput();
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

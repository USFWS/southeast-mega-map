(function() {
  'use strict';

  var lunr = require('lunr');
  var emitter = require('./mediator');
  var _ = require('./util');

  var querystring = require('query-string');
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
    opts.label.setAttribute('for', 'autocomplete-input');
    opts.input = _.create('input', 'autocomplete-input', opts.form);
    opts.input.setAttribute('id', 'autocomplete-input');
    opts.clear = _.create('button', 'autocomplete-clear', opts.form);
    opts.clear.innerHTML = 'Clear';
    opts.output = _.create('ul', 'autocomplete-results', opts.container);
  }

  function registerHandlers() {
    opts.output.addEventListener('click', delegatedOfficeLink);
    opts.form.addEventListener('submit', function (e) { e.preventDefault(); });
    opts.input.addEventListener('keyup', inputKeyup);
    opts.input.addEventListener('focus', focusInput);
    opts.clear.addEventListener('click', clearInput);
    opts.container.addEventListener('keyup', navigationHandler);
    emitter.on('marker:click', updateInputValue);
    emitter.on('blur:input', blurInput);
    emitter.on('view:changed', toggleDisplayResults)
    opts.input.focus();
  }

  function toggleDisplayResults(view) {
    if (view === 'map') opts.displayResults = true;
    else opts.displayResults = false;
  }

  function updateInputValue(office) {
    opts.input.value = office.properties.name;
  }

  function clearInput() {
    opts.input.value = '';
    opts.input.focus();
    opts.output.innerHTML = '';
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

    if (e.target.nodeName === 'A') {
      var officeName = querystring.parse(e.target.search).q.replace(/-/g, ' ');
      var office = OfficeService.getOffice(officeName);
      opts.output.innerHTML = '';
      opts.input.value = e.target.textContent;
      emitter.emit('office:selected', office);
      blurInput();
    }
  }

  function inputKeyup(e) {
    emitter.emit('autocomplete:keyup');
    if (opts.input.value.length === 0) {
      emitter.emit('autocomplete:empty', opts.data);
      opts.output.innerHTML = '';
      return;
    } else if (opts.input.value.length < opts.minLength) return;
    search(opts.input.value);
  }

  function navigationHandler(e) {
    // Up Key should go to the previous result in the list
    if (e.which === 38) goToTabbableElement('previous');
    // Down Key should go to the next result in the list
    if (e.which === 40) goToTabbableElement('next');
    // Escape should clear the results and focus on the input
    if (e.which === 27) {
      opts.input.focus();
      opts.output.innerHTML = '';
    }
  }

  function goToTabbableElement(direction) {
    if ( !_.hasClass(opts.container, 'active') ) return;
    var index, modifier;
    var tabbable = _.tabbable(opts.container);
    if (direction === 'next') modifier = 1;
    else if (direction === 'previous') modifier = -1;
    else throw new Error('Direction for _goToTabbableElement must be \'next\' or \'last\'.');

    _.each(tabbable, function (el, i) {
      if ( document.activeElement === el ) index = i + modifier;
    });

    if (index === -1) index = 0; // Don't go further than the first element
    else if (index === tabbable.length) index = index -1; // Don't go further than the last element
    tabbable[index].focus();
  }

  function focusResults() {
    var active = document.activeElement;
    var tabbable = _.tabbable(opts.container);
    console.log(tabbable);
    if ( _.hasClass(active, 'autocomplete-input') ) opts.output.querySelector('a').focus();

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

    if (opts.displayResults) render(results);
    emitter.emit('autocomplete:results', results);
  }

  function render(data) {
    opts.output.innerHTML = template({ offices: data });
  }

  module.exports.init = init;

})();

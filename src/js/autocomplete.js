const emitter = require('./mediator');
const _ = require('./util');

const querystring = require('query-string');
const template = require('../templates/autocomplete.pug');

const Autocomplete = function(data) {
  this.input = data.input;
  this.output = data.output;
  this.offices = data.offices;
  this.minLength = data.minLength || 2;
  this.displayResults = data.displayResults || true;

  this.container = _.create('div', 'autocomplete-widget', document.body);
  this.form = _.create('form', 'autocomplete-form', this.container);
  this.label = _.create('label', '', this.form);
  this.label.innerHTML = 'Search:';
  this.label.setAttribute('for', 'autocomplete-input');
  this.input = _.create('input', 'autocomplete-input', this.form);
  this.input.setAttribute('id', 'autocomplete-input');
  this.input.setAttribute('autocomplete', 'off');
  this.clear = _.create('button', 'autocomplete-clear', this.form);
  this.clear.innerHTML = 'Clear';
  this.output = _.create('ul', 'autocomplete-results', this.container);

  this.output.addEventListener('click', delegatedOfficeLink.bind(this));
  this.form.addEventListener('submit',e => e.preventDefault());
  this.input.addEventListener('keyup', this.inputKeyup.bind(this));
  this.input.addEventListener('focus', this.focusInput.bind(this));
  this.clear.addEventListener('click', this.clearInput.bind(this));
  this.container.addEventListener('keyup', navigationHandler.bind(this));
  emitter.on('marker:click', this.updateInputValue.bind(this));
  emitter.on('blur:input', this.blurInput.bind(this));
  emitter.on('view:changed', this.toggleDisplayResults.bind(this));

  this.input.focus();
};

module.exports = Autocomplete;

Autocomplete.prototype.toggleDisplayResults = function(view) {
  this.displayResults = !this.displayResults;
}

Autocomplete.prototype.updateInputValue = function(office) {
  this.input.value = office.properties.name;
}

Autocomplete.prototype.clearInput = function() {
  this.input.value = '';
  this.input.focus();
  this.output.innerHTML = '';
  emitter.emit('autocomplete:empty', this.offices.getOffices());
}

Autocomplete.prototype.focusInput = function() {
  this.container.classList.add('active');
  this.input.setAttribute('placeholder', 'Search');
}

Autocomplete.prototype.blurInput = function() {
  this.container.classList.remove('active');
  this.input.setAttribute('placeholder', '');
}

function delegatedOfficeLink (e) {
  e.preventDefault();

  if (e.target.nodeName === 'A') {
    const officeName = querystring.parse(e.target.search).q.replace(/-/g, ' ');
    const office = this.offices.search(officeName)[0];
    this.output.innerHTML = '';
    this.input.value = e.target.textContent;
    emitter.emit('office:selected', office);
    this.blurInput();
  }
}

Autocomplete.prototype.inputKeyup = function(e) {
  emitter.emit('autocomplete:keyup');
  if (this.input.value.length === 0) {
    // What's this?
    emitter.emit('autocomplete:empty', this.offices.getOffices());
    this.output.innerHTML = '';
    this.output.classList.remove('active');
    return;
  } else if (this.input.value.length < this.minLength) return;
  this.search(this.input.value);
}

Autocomplete.prototype.search = function(query) {
  const hits = this.offices.search(query);
  if (this.displayResults) this.render(hits);
  emitter.emit('autocomplete:results', hits);
}

Autocomplete.prototype.render = function(data) {
  if (data.length === 0) this.output.classList.remove('active');
  else this.output.classList.add('active');
  this.output.innerHTML = template({ offices: data, normalize: this.offices.normalizeOfficeName });
}

function goToTabbableElement(direction) {
  if ( !this.container.classList.contains('active') ) return;
  const tabbable = _.tabbable(this.container);

  let index = tabbable.filter((el, i) => {
    if ( document.activeElement === el ) return i + direction;
  })[0];

  if (index === -1) index = 0; // Don't go further than the first element
  else if (index === tabbable.length) index = index -1; // Don't go further than the last element
  tabbable[index].focus();
}

function navigationHandler(e) {
  const key = e.code || e.keyCode || e.which || 0;
  // Up Key should go to the previous result in the list
  if (key === 38) goToTabbableElement(-1);
  // Down Key should go to the next result in the list
  if (key === 40) goToTabbableElement(1);
  // Escape should clear the results and focus on the input
  if (key === 27) {
    this.input.focus();
    this.output.innerHTML = '';
    this.output.classList.remove('active');
  }
}

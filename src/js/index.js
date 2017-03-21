require('classlist-polyfill');

const xhr = require('xhr');
const qs = require('query-string');
const parallel = require('async/parallel');
const objectAssign = require('object-assign');
const _ = require('./util');
const Autocomplete = require('./autocomplete');
const OfficeList = require('./office-list');
const OfficeService = require('./offices');
const StateService = require('./states');
const Detail = require('./detail');
const Switcher = require('./view-switcher');
const Toolbar = require('./toolbar');
const Map = require('./map/');
const emitter = require('./mediator');

const wideScreen = _.getDimensions().width > 1100;
const params = objectAssign({}, qs.parse(location.search));
const landing = document.querySelector('.landing-screen');
const textViewContainer = document.querySelector('.office-list');
const mapViewContainer = document.querySelector('#map');

const tasks = [getOffices];
if (params.state) tasks.push(getStates);
parallel(tasks, initialize);

function getOffices(cb) {
  xhr.get('./data/offices.json', (err, res) => {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb(new Error('Could not download offices.'));
    return cb(null, JSON.parse(res.body));
  });
}

function getStates(cb) {
  xhr.get('./data/states.json', (err, res) => {
    if (err) return cb(err);
    if (res.statusCode !== 200) return cb(new Error('Could not download states.'));
    return cb(null, JSON.parse(res.body));
  });
}

function initialize(err, data) {
  if (err) console.log(err);
  const offices = new OfficeService(data[0]);
  const states = new StateService(data[1]);
  const initialOffice = (params.office) ? offices.search(params.office)[0] : null;
  const bounds = (params.state) ? states.getBounds(params.state, 'NAME') : offices.getBounds();

  const detail = new Detail({
    offices,
    initialOffice,
    initialView: params.hasOwnProperty('detail') || wideScreen
  });

  const autocomplete = new Autocomplete({
    input: document.querySelector('.autocomplete-input'),
    output: document.querySelector('.autocomplete-results'),
    offices
  });

  const map = new Map({
    scroll: (params.scroll === 'false') ? false : true,
    layers: (params.layers) ? normalizeParams(params.layers) : null,
    offices,
    bounds,
    initialOffice
  });

  const officeList = new OfficeList({
    list: document.querySelector('.office-list'),
    offices
  });

  const switcher = new Switcher({
    textViewContainer,
    mapViewContainer,
    view: params.view === 'text' ? 'text' : 'map'
  });

  const toolbar = new Toolbar();
  _.remove(landing);
}

function normalizeParams(params) {
  let normalized = [];
  if (typeof params === 'string') normalized.push(params);
  else normalized = params;
  return normalized.map(p => p.toLowerCase());
}

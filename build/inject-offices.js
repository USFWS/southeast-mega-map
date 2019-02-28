const cheerio = require('cheerio');
const parallel = require('async/parallel');
const objectAssign = require('object-assign');
const fs = require('fs');

const officePath = './src/data/offices.json';
const htmlPath = './dist/index.html';

const template = require('../src/templates/li');

const tasks = [
  getFile.bind(null, htmlPath),
  getFile.bind(null, officePath)
];

parallel(tasks, injectOffices);

function getFile (url, cb) {
  fs.readFile(url, 'utf-8', function(err, file) {
    if (err) return cb(err);
    cb(null, file);
  });
}

function injectOffices(err, results) {
  if (err) console.error(err);
  const $ = cheerio.load(results[0]);
  const offices = JSON.parse(results[1]);

  const data = offices.features
    .map(function(o) { return o.properties; })
    .map(function(o) { return objectAssign({icon: getIconPath(o)}, o); });

  const html = template(data);
  const $list = $('.office-list');

  $list.append(html);

  fs.writeFile(htmlPath, $.html(), 'utf-8', function(err) {
    if (err) console.error(err);
  });
}

function getIconPath(office) {
  switch (office.type) {
    case 'National Wildlife Refuge':
      return {
        src: './svg/blue-goose.svg',
        alt: 'Official Logo of the National Wildlife Refuge System'
      }
    case 'National Fish Hatchery':
      return {
        src: './svg/fisheries.svg',
        alt: 'Logo for the Fisheries program'
      }
    default:
      return {
        src: './svg/building.svg',
        alt: 'Icon representing a Field Station'
      }
    }
}

(function () {
  'use strict';

  var cheerio = require('cheerio');
  var parallel = require('async/parallel');
  var jade = require('jade');
  var fs = require('fs');
  var map = require('lodash.map');

  var officePath = './src/data/offices.json';
  var htmlPath = './dist/index.html';

  var template = jade.compileFile('./src/templates/li.jade');

  var tasks = [
    getFile.bind(null, htmlPath),
    getFile.bind(null, officePath)
  ];

  parallel(tasks, injectOffices);

  function getFile (url, cb) {
    fs.readFile(url, 'utf-8', function (err, file) {
      if (err) return cb(err);
      cb(null, file);
    });
  }

  function injectOffices(err, results) {
    if (err) console.error(err);
    var offices = JSON.parse(results[1]);

    var $ = cheerio.load(results[0]);

    offices = map(offices.features, function (office) {
      office.properties.icon = getIconPath(office);
      return office;
    });
    var html = template({ offices: offices });

    var $list = $('.office-list');

    $list.append(html);

    fs.writeFile(htmlPath, $.html(), 'utf-8', function (err) {
      if (err) console.error(err);
    });
  }

  function getIconPath(office) {
    var path = ['./svg/'];
    switch (office.properties.type) {
      case 'National Wildlife Refuge':
        path.push('blue-goose.svg');
        break;
      case 'National Fish Hatchery':
        path.push('fisheries.svg');
        break;
      default:
        path.push('building.svg');
        break;
     }
     return path.join('');
  }


})();

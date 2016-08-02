(function () {
  'use strict';

  var cheerio = require('cheerio');
  var parallel = require('async/parallel');
  var jade = require('jade');
  var fs = require('fs');

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
    var html = template({ offices: offices.features });

    var $list = $('.office-list');

    $list.append(html);

    fs.writeFile(htmlPath, $.html(), 'utf-8', function (err) {
      if (err) console.error(err);
    });
  }


})();

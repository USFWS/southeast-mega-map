(function () {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var jsonminify = require('jsonminify');
  var input = 'src/data';
  var output = 'dist/data'

  init();

  fs.watch(input, readFile);

  function init() {
    fs.readdir(input, function(err, files) {
      if (err) console.error(err);
      var filepath, json;

      files.forEach(function (filename) {
        readFile('change', filename);
      });
    })
  }

  function readFile(event, filename) {
    var filepath = path.join(input, filename);
    fs.readFile(filepath, 'utf8', function(err, file) {
      if (err) console.error(err);
      minify(filename, file);
    });
  }

  function minify(filename, file) {
    var minified = jsonminify(file);
    var outpath = path.join(output, filename);
    fs.writeFile(outpath, minified, 'utf8', function(err) {
      if (err) console.error(err);
      else console.log('Minified: ' + outpath);
    });
  }
})();

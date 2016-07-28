(function () {
  'use strict';

  var mkdirp = require('mkdirp');
  var directories = ['dist/css', 'dist/js', 'dist/images', 'dist/data'];

  console.log('Creating dist directory');

  directories.forEach(function (path) {
    mkdirp(path, function (err) {
      if (err) console.error(err);
    });
  });
})();

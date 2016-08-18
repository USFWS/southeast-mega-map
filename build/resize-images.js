(function () {
  'use strict';
  var sharp = require('sharp');
  var mkdirp = require('mkdirp');
  var fs = require('fs');

  var input = 'src/images/offices/';
  var output = 'dist/images/';
  var images = fs.readdirSync(input);

  // If there's a DS Store item, remove it
  var i = images.indexOf('.DS_Store');
  if (i > -1) images.splice(i,1);

  // Ensure the output dir exists
  mkdirp(output, function (err) {
    if (err) console.error(err);
    images.forEach(function (name) {
      var img = sharp(input + name);
      img
        .resize(500, null)
        .toFile(output + name);
    });
  });
})();

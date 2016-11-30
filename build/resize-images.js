(function () {
  'use strict';
  var sharp = require('sharp');
  var mkdirp = require('mkdirp');
  var rimraf = require('rimraf');
  var imagemin = require('imagemin');
  var imageminMozjpeg = require('imagemin-mozjpeg');
  var fs = require('fs');

  var input = 'src/images/offices/';
  var output = 'dist/images/';
  var images = fs.readdirSync(input);

  // If there's a DS Store item, remove it
  var i = images.indexOf('.DS_Store');
  if (i > -1) images.splice(i,1);

  // Ensure the output dir exists
  rimraf(output + '/*', () => {
    mkdirp(output, (err) => {
      if (err) console.error(err);
      images.forEach((name) => {
        var img = sharp(input + name);
        img
          .resize(500, null)
          .toBuffer( (err, buffer, info) => {
            if (err) console.error(err);
            minify(buffer, output + name);
          });
      });
    });
  });

  function minify(buffer, filename) {
    imagemin.buffer(buffer, filename, {
      plugins: [
        imageminMozjpeg()
      ]
    }).then( (buffer) => {
      fs.writeFile(filename, buffer, 'utf8', (err) => {
        if (err) console.error(err);
      });
    });
  }
})();

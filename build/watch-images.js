(function () {
  'use strict';

  var sharp = require('sharp');
  var chokidar = require('chokidar');
  var mkdirp = require('mkdirp');
  var imagemin = require('imagemin');
  var imageminMozjpeg = require('imagemin-mozjpeg');
  var fs = require('fs');
  var path = require('path');

  var input = 'src/images/offices/';
  var output = 'dist/images/';
  var images = fs.readdirSync(input);

  // If there's a DS Store item, remove it
  var i = images.indexOf('.DS_Store');
  if (i > -1) images.splice(i,1);

  // Ensure the output dir exists
  mkdirp(output, (err) => {
    if (err) console.error(err);
    watcher();
  });

  function watcher() {
    chokidar.watch(input + '*.jpg')
      .on('add', processImage)
      .on('change', processImage)
      .on('unlink', removeImage);
  }

  function processImage(filepath) {
    console.log(`Processing ${filepath}`);
    if (filepath.indexOf('.DS_Store') > -1) return;
    var outfile = path.join( output, path.basename(filepath) );
    var img = sharp(filepath);
    img
      .resize(500, null)
      .toBuffer(function (err, buffer, info) {
        if (err) console.error(err);
        minify(buffer, outfile);
      });
  }

  function minify(buffer, filename) {
    imagemin.buffer(buffer, filename, {
      plugins: [
        imageminMozjpeg()
      ]
    }).then(function(buffer) {
      fs.writeFile(filename, buffer, 'utf8', function(err) {
        if (err) console.error(err);
      });
    });
  }

  function removeImage(filepath) {
    var fileToDelete = path.join( output + path.basename(filepath) );
    fs.access(fileToDelete, (err) => {
      if (err) console.error(err);
      else {
        fs.unlink(fileToDelete, (err) => {
          if (err) console.error(err);
        });
      }
    });
  }
})();

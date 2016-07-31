(function() {
  'use strict';

  var qs = require('query-string');

  function parse(url) {
    return qs.parse(url);
  }

  function stringify(urlString) {
    var queryString;
    if (urlString) queryString = qs.parse(urlString);
    else queryString = qs.parse(window.location.search);

    if (queryString.q) return queryString.q.replace(/-/g, ' ');
    else return false;
  }

  module.exports = {
    parse: parse,
    stringify: stringify
  }

})();

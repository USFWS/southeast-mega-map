(function() {
  'use strict';

  var url = require('url');

  exports.stringify = function stringify (urlString) {
    var queryString;
    if (urlString)
      queryString = url.parse(urlString, true).query;
    else
      queryString = url.parse(window.location.href, true).query;

    if (queryString.q)
      return queryString.q.replace(/-/g, ' ');
    else
      return false;
  };

})();

(function () {
  'use strict';

  module.exports.getDimensions = function (){
  	var test = document.createElement( "div" );

  	test.style.cssText = "position: fixed;top: 0;left: 0;bottom: 0;right: 0;";
  	document.documentElement.insertBefore( test, document.documentElement.firstChild );

  	var dims = { width: test.offsetWidth, height: test.offsetHeight };
  	document.documentElement.removeChild( test );

  	return dims;
  }
})();

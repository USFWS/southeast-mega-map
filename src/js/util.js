(function () {
  'use strict';

  require('classlist-polyfill');

  var _ = {
    defaults: require('lodash.defaults'),
    map: require('lodash.map'),
    includes: require('lodash.includes'),
    each: require('lodash.foreach'),
    slugify: require('underscore.string/slugify'),
    tabbable: require('tabbable'),
    create: create,
    remove: remove,
    addClass: addClass,
    addClasses: addClasses,
    hasClass: require('has-class'),
    removeClass: removeClass,
    toggleClass: toggleClass,
    getDimensions: getDimensions
  };

  function create(tagName, className, container) {
    var el = document.createElement(tagName);

    if (typeof className === 'string') el.className = className;
    else if (typeof className === 'object') addClasses(el, className);

    if (container) container.appendChild(el);

    return el;
  }

  function remove(el) {
    var parent = el.parentNode;
    if (parent) parent.removeChild(el);
  }

  function addClass(el, name) {
    el.classList.add(name);
  }

  function addClasses(el, classes) {
    classes.forEach(function (name) {
      el.classList.add(name);
    });
  }

  function removeClass(el, name) {
    el.classList.remove(name);
  }

  function toggleClass(el, name) {
    el.classList.toggle(name);
  }

  function getDimensions(){
  	var test = document.createElement( "div" );

  	test.style.cssText = "position: fixed;top: 0;left: 0;bottom: 0;right: 0;";
  	document.documentElement.insertBefore( test, document.documentElement.firstChild );

  	var dims = { width: test.offsetWidth, height: test.offsetHeight };
  	document.documentElement.removeChild( test );

  	return dims;
  }

  module.exports = _;

})();

(function () {
  'use strict';

  require('classlist-polyfill');

  var _ = {
    defaults: require('lodash.defaults'),
    find: require('lodash.find'),
    includes: require('lodash.includes'),
    slugify: require('underscore.string/slugify'),
    create: create,
    remove: remove,
    addClass: addClass,
    addClasses: addClasses,
    removeClass: removeClass,
    toggleClass: toggleClass
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

  module.exports = _;

})();

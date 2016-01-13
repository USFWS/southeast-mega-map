(function () {
  'use strict';
  require('classlist-polyfill');

  function create(tagName, className, container) {
    var el = document.createElement(tagName);

    if (typeof className === 'string')
      el.className = className;
    else if (typeof className === 'object')
      addClasses(el, className);

    if (container)
      container.appendChild(el);

    return el;
  }

  function remove(el) {
    var parent = el.parentNode;
    if (parent)
      parent.removeChild(el);
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

  module.exports.create = create;
  module.exports.remove = remove;
  module.exports.addClass = addClass;
  module.exports.removeClass = removeClass;
  module.exports.toggleClass = toggleClass;

})();

(function () {
  'use strict';

  function create(tagName, className, container) {
    var el = document.createElement(tagName);
    el.className = className;

    if (container)
      container.appendChild(el);

    return el;
  }

  function remove(el) {
    var parent = el.parentNode;
    if (parent)
      parent.removeChild(el);
  }

  module.exports.create = create;
  module.exports.remove = remove;
})();

var _ = require('../js/util');

module.exports = function(offices, normalize) {
  return offices.map(function(office) {
    const name = normalize(office.properties.name);
    const slug = `/?q=${ _.slugify(name).toLowerCase()}`;
    return `
      <li>
        <a href="${slug}" class="autocomplete-link">${office.properties.name}</a>
      </li>
    `
  });
};

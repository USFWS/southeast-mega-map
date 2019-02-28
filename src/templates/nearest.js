const _ = require('../js/util');

const createOfficeItem = office => {
  const name = office.layer.feature.properties.name;
  const slug = `?office=${_.slugify(name).toLowerCase()}`;
  return `<li><a href="${slug}">${name}</a></li>`
};

module.exports = nearest => `
  <h2>Nearest Offices</h2>
  <ul class="nearest-offices">
    ${nearest.map(createOfficeItem).join('')}
  </ul>
`;
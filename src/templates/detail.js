const _ = require("../js/util");
const website = require("../svg/webpage");
const facebook = require("../svg/facebook");
const twitter = require("../svg/twitter");

const getActivityIcon = activity => {
  switch (activity) {
    case "Wildlife Photography":
      return `<img src="./svg/wildlife-photography.svg" alt="Camera icon"/>`;
    case "Wildlife Observation":
      return `<img src="./svg/wildlife-observation.svg" alt="Icon"/>`;
    case "Environmental Education":
      return `<img src="./svg/education.svg" alt="Mortar board icon"/>`;
    case "Interpretation":
      return `<img src="./svg/interpretation.svg" alt="Interpretive sign icon"/>`;
    case "Hiking":
      return `<img src="./svg/hiking.svg" alt="Hiking icon"/>`;
    case "Fishing":
      return `<img src="./svg/fishing.svg" alt="Fish icon"/>`;
    case "Hunting":
      return `<img src="./svg/hunting.svg" alt="Hunting icon"/>`;
    case "Boat Ramp":
      return `<img src="./svg/boat-ramp.svg" alt="Boat ramp icon"/>`;
    case "Canoeing":
      return `<img src="./svg/canoeing.svg" alt="Canoe icon"/>`;
    case "Lighthouse":
      return `<img src="./svg/lighthouse.svg" alt="Lighthouse icon"/>`;
    case "Picnic":
      return `<img src="./svg/picnic-shelter.svg" alt="Picnic table icon"/>`;
  }
};

const createListItem = (office, test, svg, text) => {
  return test
    ? `<li><a href ="${
        office.url
      }" title="${text}" target="_blank">${svg()}<p>${text}</p></a></li>`
    : "";
};

const createActivityList = office => {
  const activities = `
    <ul class="detail-activities">
      ${office.activities
        .map(activity => `<li>${getActivityIcon(activity)} ${activity}</li>`)
        .join("")}
    </ul>
  `;
  return [`<h3>Activities</h3>`, ...activities].join("");
};

const getOfficeImage = office => {
  return office.image
    ? `
    <a href="${office.imageurl}" target='_blank'>
      <img class="detail-image" src="./images/${office.image}" alt="${
        office.alt
      }" />
    </a>
    <p class="office-photo-caption">${office.caption}</p>`
    : "";
};

module.exports = function(office) {
  return `
    <h2>${office.name}</h2>

    ${getOfficeImage(office)}

    <ul class="detail-links">
      ${createListItem(office, office.url, website, "Website")}
      ${createListItem(office, office.facebook, facebook, "Facebook")}
      ${createListItem(office, office.twitter, twitter, "Twitter")}
    </ul>

    <div class="detail-content-wrap">
      <p class="detail-description">${office.narrative}</p>
      ${createActivityList(office)}

      <h3>Address</h3>
      ${office.phone ? `<p>Phone: ${office.phone}</p>` : ""}
      <address>
        ${office.address} <br/>
        ${office.city}, ${office.state} ${office.zip}
      </address>
    </div>
    `;
};

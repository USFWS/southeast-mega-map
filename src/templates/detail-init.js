module.exports = () => `
  <h1 class="map-title">Southeast Region<br>Office Map</h1>
  <img class="logo" src="./svg/logo.svg" alt="Official logo of the U.S. Fish and Wildlife Service" />

  <div class="detail-content-wrap">
    <p>Use the map to find a U.S. Fish and Wildlife Service field office, National Wildlife Refuge, or a National Fish Hatchery near you.  For more information about a specific office click an office marker on the map.</p>

    <h3>Map Icons</h3>
    <ul class="icon-list">
      <li><img class="icon" src="./images/layers-2x.png" alt="Image representing layers in 3-D"/> Toggle layers on/off</li>
      <li><img class="icon" src="./svg/full-extent.svg" alt="Icon with arrows pointing outwards"/> Zoom out to show all offices</li>
      <li><img class="icon" src="./svg/current-location.svg" alt="Icon representing your current location"/> Find the nearest offices</li>
      <li><img class="icon" src="./svg/help.svg" alt="Icon representing 'help'"/> Learn more about the map</li>
    </ul>

    <h3>Office Types</h3>
    <ul class="icon-list">
      <li><img class="marker" src="./svg/blue-goose.svg" alt="Official logo of the National Wildlife Refuge System"/> National Wildlife Refuge</li>
      <li><img class="marker" src="./svg/fisheries.svg" alt="Official logo of the Fisheries program"/> National Fish Hatchery</li>
      <li><img class="marker" src="./svg/building.svg" alt="Icon representing a field office"/>Field Station</li>
    </ul>
  </div>
`;

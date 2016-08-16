## Mega map

Mega map is a one-stop-shop interactive map for exploring details about U.S. Fish & Wildlife Service offices in the Southeast Region.

This project is under active development.

## Disable Scroll Wheel Zoom

If you embed this map into your webpage you'll want to disable scroll wheel zoom such that the user can scroll down the page without getting stuck in the map.  By default the map module supports an option `disableScrollClass`, which takes a string (defaults to `.disable-scroll-wheel`).  If you add the `disableScrollClass` to the map DOM element or it's parent you can avoid the scroll trap.  Users can still double click or use the `+` or `-` buttons in the bottom right corner of the map to zoom in and out.

## Deep Linking

Deep linking refers to using a URL to content within a website or page rather than the homepage.  In the context of mega map deep linking refers to controlling map state through the construction of a URL.  Mega map currently supports setting the initial map bounds (zoom) over a state/territory or list of states/territories as well as toggling of layers when the map initializes.

### Initialize Map Over a State/Territory

By default the map fit's it's bounds to the cluster of offices layers.  If instead you'd like to start the map over a state/territory or several states/territories use the `state` query parameter.  You can use either state names or abbreviations, both of which are case insensitive. Spaces might be replaced with the appropriate URL encoding automatically , but to be safe you should replace spaces with either `+`, or `%20` (`+` seems to be easier to read).

#### Example URLS:
- Alabama and Florida: [`https://usfws.github.io/southeast-mega-map/?state=AL&state=GA`](https://usfws.github.io/southeast-mega-map/?state=AL&state=GA)
- Puerto Rico and Virgin Islands: [`https://usfws.github.io/southeast-mega-map/?state=Puerto+Rico&state=VI`](https://usfws.github.io/southeast-mega-map/?state=Puerto+Rico&state=VI)
- North Carolina: [`https://usfws.github.io/southeast-mega-map/?state=north%20carolina`](https://usfws.github.io/southeast-mega-map/?state=north%20carolina)

### Initialize On a Specific Office

To zoom the map to a specific office when the map loads use the `?office` query parameter.  If you provide more than one office `?office=Currituck+National+Wildlife+Refuge&office=Kentucky+Ecological+Services+Field+Office` only the first office will be used.  To figure out what the field station is called click on or search for the office and take note of the office's name.

#### Example URLS:

- Currituck National Wildlife Refuge: [https://usfws.github.io/southeast-mega-map/?office=Currituck+National+Wildlife+Refuge](https://usfws.github.io/southeast-mega-map/?office=Currituck+National+Wildlife+Refuge)
- Kentucky Ecological Service Field Office: [https://usfws.github.io/southeast-mega-map/?office=Kentucky+Ecological+Services+Field+Office](https://usfws.github.io/southeast-mega-map/?office=Kentucky+Ecological+Services+Field+Office)
- Dale Hallow National Fish Hatchery: [https://usfws.github.io/southeast-mega-map/?office=Dale+Hollow+National+Fish+Hatchery](https://usfws.github.io/southeast-mega-map/?office=Dale+Hollow+National+Fish+Hatchery)

### Toggling Layers on Load

By default all of the office types are enabled on page load.  If you would prefer to display one or more layers on load use the `layers` query parameter.  If this parameter is present only those layers including in the URL will be displayed on the map when it loads.  For the exact names of layers that can be toggled check out the layer switcher in the top right of the screen.  For example, if you want to toggle the FWC Offices layer check the layer switcher and you'll find you should use: `?layer=fish+and+wildlife+conservation+offices`

![Layer Switcher](https://github.com/USFWS/southeast-mega-map/blob/master/layer-switcher.png)

#### Example URLS:
- Display only Refuges: [`https://usfws.github.io/southeast-mega-map/?layers=Refuges`](https://usfws.github.io/southeast-mega-map/?layers=Refuges)
- Display Refuges and Hatcheries: [`https://usfws.github.io/southeast-mega-map/?layers=Refuges&layers=hatcheries`](https://usfws.github.io/southeast-mega-map/?layers=Refuges&layers=hatcheries)
- Display only Refuges and zoom to Louisiana: [`https://usfws.github.io/southeast-mega-map/?layers=Refuges&state=Louisiana`](https://usfws.github.io/southeast-mega-map/?layers=Refuges&state=Louisiana)

### Display Detail Panel

The detail panel is hidden by default when the page loads.  If you want to have it displayed just include `?detail=true` in the URL.

### Example:

- Zoom to Alabama with the Detail panel open: [`https://usfws.github.io/southeast-mega-map/?detail=true&state=Alabama`](https://usfws.github.io/southeast-mega-map/?detail=true&state=Alabama)

### Development

First install project dependencies:

`npm install`

To run a development server that will bundle JS files, compile SCSS to CSS, etc:

`npm start`

To produce a production ready build:

`npm run build`

Bundling packages can lead to bloat if you're not careful.  To visualize files contributing to bundle size:

`npm run inspect:bundle`

Publish a production demo to gh-pages:

`npm run publish:demo`

To run tests:

`npm test`

**Still trying to figure out testing**

### License

This project is in the public domain.

The United States Fish and Wildlife Service (FWS) GitHub project code is provided on an "as is" basis and the user assumes responsibility for its use. FWS has relinquished control
of the information and no longer has responsibility to protect the integrity, confidentiality, or availability of the information. Any reference to specific commercial products, processes, or services by service mark, trademark, manufacturer, or otherwise, does not constitute or imply their endorsement, recommendation or favoring by FWS. The FWS seal and logo shall not be used in any manner to imply endorsement of any commercial product or activity by FWS or the United States Government.

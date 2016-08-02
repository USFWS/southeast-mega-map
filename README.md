## Mega map

Mega map is a one-stop-shop interactive map for exploring details about U.S. Fish & Wildlife Service offices in the Southeast Region.

This project is under active development.

## Known Issue

Jpegtran-bin is a pain;  I can't get the newer version to install.  I had to install a specific version `npm i -D jpegtran-bin@3.0.4`, then copy the `vendor` folder over to `node_modules/imagemin-cli/node_modules/imagemin-jpegtran/`.

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
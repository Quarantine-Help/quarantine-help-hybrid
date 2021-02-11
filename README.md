# QuarantineHelp

[![Maintainability](https://api.codeclimate.com/v1/badges/0184dd0103afb39b9b36/maintainability)](https://codeclimate.com/github/Quarantine-Help/quarantine-help-hybrid/maintainability)
[![Depfu](https://badges.depfu.com/badges/8bf41f1c7aea414b96f712e8d77f86be/count.svg)](https://depfu.com/github/Quarantine-Help/quarantine-help-hybrid?project_id=11656)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Netlify Status](https://img.shields.io/netlify/c3bf37cb-7592-4f95-8e89-c2636bfd9bf0?label=netlify%20live)](https://app.netlify.com/sites/qhmobile/deploys)
[![Netlify Status](https://img.shields.io/netlify/5b4633d8-6473-4c15-bed7-acf6b442adf1?label=netlify%20dev)](https://app.netlify.com/sites/qhmobiledev/deploys)
[![Slack](https://cdn.brandfolder.io/5H442O3W/as/pl546j-7le8zk-ex8w65/Slack_RGB.auto?width=78&height=20)][slack-invite]

A hybrid mobile frontend for the QuarantineHelp project. The project aims to help people to find help while in quarantine.

This repo contains the hybrid app frontend built using the Ionic Framework. The PWA version of the app can be found at https://mobile.quarantinehelp.space and an active dev version at https://mobiledev.quarantinehelp.space

## Getting started

### Local Development server

- After [installing up nodeJS and Ionic](https://ionicframework.com/docs/installation/cli), you can run `ng serve` for a dev server.
- Navigate to `http://localhost:8100/`. The app will automatically reload if you change any of the source files.
- You could also run `ionic serve --prod --ssl` to test an ionic production build locally.

## Build

Run `ionic build` to build the project. The build artifacts will be stored in the `www/` directory. Use the `--prod` flag for a production build.

## Generate icons & splash images

Run `cordova-res android --skip-config --copy` after installing `cordova-res` by running `npm install -g cordova-res`.

#### Copy your Web Assets

When you are ready to run your app natively on a device or in a simulator, copy your built web assets using `npx cap copy`.

Note: You may need to run `npx cap sync` if you wish to update the native dependencies too.

#### Open your Native IDE

Capacitor uses the Native IDEs to build, simulate, and run your app. To open it run `npx cap open`

Tip : I have added npm scripts `capDev` and `capProd` that could be used to run the above steps in a single command. So may use it like `npm run capDev` to build the Ionic project, sync for capacitor and open up Android Studio.

## Contributing

Go through the Github issues and find something you can work on. Read the [conrtibution guidelines](https://github.com/Quarantine-Help/quarantine-help-hybrid/blob/master/CONTRIBUTING.md). Ask questions and let us know before you take up something.

Do join us on [![Slack](https://cdn.brandfolder.io/5H442O3W/as/pl546j-7le8zk-ex8w65/Slack_RGB.auto?width=78&height=20)][slack-invite] for the discussions.

## License

This project is made available under the terms of the GPLv3. See the [LICENSE][license] file for the full text of the license.

[license]: https://github.com/Quarantine-Help/quarantine-help-hybrid/blob/master/LICENSE
[slack-invite]: https://join.slack.com/t/quarantinehelp/shared_invite/zt-d0259x7q-BiC_viQhLRoQqqc5j~P0uw

## Sponsorship

<br>

### <a href="https://lokalise.com/" target=”_blank”><img src="src/assets/icons/lokalise.svg" alt="Lokalise" width="150" /></a>

Lokalise supports this project and has provided us with an Enterprise Open Source plan to make the translation of this project possible ❤️

We're currently in the process of setting up Lokalise, and welcome all contributions in translating the project.

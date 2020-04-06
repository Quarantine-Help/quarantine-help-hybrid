# QuarantineHelp

[![Maintainability](https://api.codeclimate.com/v1/badges/16dd5e6b09dc22885e35/maintainability)](https://codeclimate.com/github/Quarantined-Help/quarantined-hybrid-app/maintainability)
[![Depfu](https://badges.depfu.com/badges/8bf41f1c7aea414b96f712e8d77f86be/count.svg)](https://depfu.com/github/Quarantined-Help/quarantined-hybrid-app?project_id=11656)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Slack](https://cdn.brandfolder.io/5H442O3W/as/pl546j-7le8zk-ex8w65/Slack_RGB.auto?width=78&height=20)][slack-invite]

A hybrid mobile frontend for the QuarantineHelp project. The project aims to help people to find help while in quarantine.

This repo contains the hybrid app frontend built using the Ionic Framework. The PWA version of the app can be found at https://mobile.quarantinehelp.space/.

## Getting started

### Local Development server

- After [installing up nodeJS and Ionic](https://ionicframework.com/docs/installation/cli), you can run `ng serve` for a dev server.
- Navigate to `http://localhost:8100/`. The app will automatically reload if you change any of the source files.

## Build

Run `ionic build` to build the project. The build artifacts will be stored in the `www/` directory. Use the `--prod` flag for a production build.

#### Copy your Web Assets

When you are ready to run your app natively on a device or in a simulator, copy your built web assets using `npx cap copy`.

Note: You may need to run `npx cap sync` if you wish to update the native dependencies too.

#### Open your Native IDE

Capacitor uses the Native IDEs to build, simulate, and run your app. To open it run `npx cap open`

## Contributing

Go through the Github issues and find something you can work on. Read the [conrtibution guidelines](https://github.com/Quarantine-Help/quarantine-hybrid-app/blob/master/CONTRIBUTING.md). Ask questions and let us know before you take up something. 

Do join us on [![Slack](https://cdn.brandfolder.io/5H442O3W/as/pl546j-7le8zk-ex8w65/Slack_RGB.auto?width=78&height=20)][slack-invite] for the discussions.

## License

This project is made available under the terms of the GPLv3. See the [LICENSE][license] file for the full text of the license.

[license]: https://github.com/Quarantine-Help/quarantine-hybrid-app/blob/master/LICENSE
[slack-invite]: https://join.slack.com/t/quarantinehelp/shared_invite/zt-d0259x7q-BiC_viQhLRoQqqc5j~P0uw

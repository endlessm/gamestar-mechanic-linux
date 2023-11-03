# gamestar-mechanic-app

Gamestar Mechanic desktop app.

This application is a simple viewer for https://gamestarmechanic.com. It uses
Electron with the PPAPI Flash plugin enabled, allowing the user to access the
site's Flash content.

### Getting started

The best way to try the Gamestar Mechanic app is to install it from Flathub:

<a href="https://flathub.org/apps/details/com.gamestarmechanic.app">
<img
    src="https://flathub.org/assets/badges/flathub-badge-i-en.png"
    alt="Download Gamestar Mechanic on Flathub"
    width="240px"
    height="80px"
/>
</a>

### Building

To build and run this project, you can use [yarn](https://yarnpkg.com):

    yarn install
    yarn run start

To produce a distributable package, you can use the `pack` script:

    yarn run pack

The resulting files will be located in the `dist` directory.


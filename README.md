# gamestar-mechanic-app

Gamestar Mechanic desktop app.

This application is a simple viewer for https://gamestarmechanic.com. It uses
Electron with the PPAPI Flash plugin enabled, allowing the user to access the
site's Flash content.

### Getting started

The best way to try the Gamestar Mechanic app is to install it from Flathub:

<a href="https://flathub.org/apps/details/com.gamestarmechanic.gamestarmechanic">
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

### Developer documentation

#### Managing release notes

While making changes for an upcoming release, please update [com.gamestarmechanic.gamestarmechanic.metainfo.xml](res/com.gamestarmechanic.gamestarmechanic.metainfo.xml)
with information about those changes. In the `<releases>` section, there should
always be a release entry with `version` set to the previous version followed by
`+next`, like this:

```
<release version="1.2.1+next" date="2023-11-03" type="development">
  <description>
    <ul>
      <li>The description of a new feature goes here.</li>
    </ul>
  </description>
</release>
```

If there is not one, please create one as the first entry in `<releases>`.

#### Creating releases

To create a release, use [bump-my-version](<https://pypi.org/project/bump-my-version/>):

```
bump-my-version bump minor
git push
git push --tags
```

This will create a new git tag, update the `VERSION` file in the project root,
and update the "+next" release entry in [com.gamestarmechanic.app.metainfo.xml](res/com.gamestarmechanic.app.metainfo.xml).

Note that it is possible to increment either the `major`, `minor`, or `patch`
component of the project's version number.


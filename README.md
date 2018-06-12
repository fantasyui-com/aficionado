# aficionado
CSS class explorer and preview UI aimed at CSS-gradient backgrounds.

[Demo](https://rawgit.com/fantasyui-com/aficionado/master/dist/index.html)

![](readme/icon.png)
![](readme/screenshot.png)

Aficionado builds a responsive Apple Preview like library featuring your favorite
CSS background library. The results are stored in ./dist/

# TODO & NOTES

build.js contains
const project = require("nightfall");

and src/model.json
"prefix": "nightfall",

This must be automated...

How to automate installation of synthwave and nightfall?
Probably by just installing both of them in here.
THen a require would take a string, and build's json handler
can write the chosen background set into .prefix.

Choice should be specified/automated via CLI. Thus: running ```aficionado``` inside nightfall will create index.html with the preview code inside.

Note aficionado uses the compiled style.json, to rebuild that you need to use
another system: ```gogh```.

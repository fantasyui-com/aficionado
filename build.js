#!/usr/bin/env node

const project = require("nightfall");

const fs = require('fs');
const path = require('path');
const distr = require('distr');
const chalk = require('chalk');
const watcher = require('watch');
const Handlebars = require('handlebars');
const posthtml = require('posthtml');
const posthtmlCustomElements = require('posthtml-custom-elements');
const minifier = require('posthtml-minifier');

const { transform } = require('babel-core');
const  babel = require('babel-core');

Handlebars.registerHelper('css', function(letter) {
  let response = project.css( letter );
  return response;
});

Handlebars.registerHelper('style', function(letter) {
  let response = project.css( /./ );
  return response;
});

function watch(pattern, updater, defer){
  var update = function(i){
    updater(i);
    console.log('[%s] %s', chalk.yellow("✓"), chalk.green(path.basename(i)))
  };
  watcher.watchTree(path.join(__dirname,'src'), {filter: function(source){ return source.match( pattern ) }, ignoreDirectoryPattern:/node_modules/}, function (f, curr, prev) {
    if (typeof f == "object" && prev === null && curr === null) {
      // Finished walking the tree
    //  console.log( f );
      //console.log('JS Watcher is monitoring: ' + chalk.yellow( Object.keys(f).filter(i=>i.match(pattern)).join(', ') ));
      if(!defer) Object.keys(f).filter(i=>i.match(pattern)).map(i=>update(i));

    } else if (prev === null) {
      // f is a new file
      update(f);

    } else if (curr.nlink === 0) {

      // f was removed
      // do nothing updateCss(f);
      // user is expected to cleanup

    } else {
      // f was changed
      update(f);
    }
  });
}

function updateHtml(source){
  const destination = distr(source);
  const minifierOptions = {
    collapseWhitespace: false,
    preserveLineBreaks: false,
    removeComments: false,
    minifyCSS: false,
    minifyJS: false
  };
  const postResult = posthtml()
  .use(posthtmlCustomElements())
  .use(minifier(minifierOptions))
  .process(fs.readFileSync(source), { sync: true })
  .html
  const template = Handlebars.compile(postResult);
  const data = JSON.parse(fs.readFileSync(__dirname+'/src/model.json').toString());
  const hbsResult = template(data);
  fs.writeFileSync(destination, hbsResult);
}

function updateCss(source){
  const destination = distr(source);
  fs.copyFileSync(source, destination);
}

function updateJs(source){
  const destination = distr(source);
  fs.writeFileSync(destination, babel.transformFileSync(source,{}).code);
}

watch(/\.html$/, updateHtml);
watch(/^model\.json$/, updateHtml, false);
watch(/\.css/, updateCss);
watch(/\.js$/, updateJs);

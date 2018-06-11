#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const distr = require('distr');
const chalk = require('chalk');
const watch = require('watch');
const Handlebars = require('handlebars');
const posthtml = require('posthtml');
const posthtmlCustomElements = require('posthtml-custom-elements');
const minifier = require('posthtml-minifier');
const Bundler = require('parcel-bundler');

function updateHtml(source){
  const destination = distr(source);
  console.log( 'updateHtml: Compiling: [%s]->[%s]', chalk.yellow(source), chalk.green(destination) );

  const minifierOptions = {
    // collapseWhitespace: true,
    // preserveLineBreaks: false,
    // removeComments: true,
    // minifyCSS: true,
    // minifyJS: true
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

function updateJs(source){
  const destination = distr(source);
  console.log( 'Compiling: [%s]->[%s]', chalk.yellow(source), chalk.green(destination) );

  const options = {
    outDir: path.dirname(destination), // The out directory to put the build files in, defaults to dist
    outFile: path.basename(destination), // The name of the outputFile
    publicUrl: './', // The url to server on, defaults to dist
    watch: false, // whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
    cache: true, // Enabled or disables caching, defaults to true
    cacheDir: '.parcel-cache', // The directory cache gets put in, defaults to .cache
    minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
    target: 'browser', // browser/node/electron, defaults to browser
    https: false, // Server files over https or http, defaults to false
    logLevel: 3, // 3 = log everything, 2 = log warnings & errors, 1 = log errors
    hmrPort: 0, // The port the hmr socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
    sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (not supported in minified builds yet)
    hmrHostname: '', // A hostname for hot module reload, default to ''
    detailedReport: false // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
  };

  const bundler = new Bundler(source, options);
  const bundle = bundler.bundle();
}


watch.watchTree(path.join(__dirname,'src'), {filter: function(source){ return source.match(/\.html$/) }, ignoreDirectoryPattern:/node_modules/}, function (f, curr, prev) {
  if (typeof f == "object" && prev === null && curr === null) {
    // Finished walking the tree
    //console.log( f );
    console.log(chalk.yellow( 'HTML Watcher is monitoring:' ));
    console.log(chalk.yellow( Object.keys(f).filter(i=>i.match(/\.html$/)).join('\n') ));
    console.log(chalk.yellow( '' ));
    Object.keys(f).filter(i=>i.match(/\.src\.html$/)).map(i=>updateHtml(i));

  } else if (prev === null) {
    // f is a new file
    updateHtml(f);

  } else if (curr.nlink === 0) {

    // f was removed
    // do nothing updateHtml(f);
    // user is expected to cleanup

  } else {
    // f was changed
    updateHtml(f);
  }
})
watch.watchTree(path.join(__dirname,'src'), {filter: function(source){ return source.match(/\.js$/) }, ignoreDirectoryPattern:/node_modules/}, function (f, curr, prev) {
  if (typeof f == "object" && prev === null && curr === null) {
    // Finished walking the tree
  //  console.log( f );
    console.log(chalk.yellow( 'JS Watcher is monitoring:' ));
    console.log(chalk.yellow( Object.keys(f).filter(i=>i.match(/\.js$/)).join('\n') ));
    console.log(chalk.yellow( '' ));
    Object.keys(f).filter(i=>i.match(/\.src\.js/)).map(i=>updateJs(i));

  } else if (prev === null) {
    // f is a new file
    updateJs(f);

  } else if (curr.nlink === 0) {

    // f was removed
    // do nothing updateCss(f);
    // user is expected to cleanup

  } else {
    // f was changed
    updateJs(f);
  }
})
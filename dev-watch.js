#!/usr/bin/env node

const fs = require('fs');

const path = require('path');

const chalk = require('chalk');
const watch = require('watch');

const Handlebars = require('handlebars');

const posthtml = require('posthtml');
const posthtmlCustomElements = require('posthtml-custom-elements');
const minifier = require('posthtml-minifier');
const minifierOptions = {
  // collapseWhitespace: true,
  // preserveLineBreaks: false,
  // removeComments: true,
  // minifyCSS: true,
  // minifyJS: true
};

function updateHtml(source){

  console.log(chalk.green('Recompiled: '+source));

  const postResult = posthtml()
  .use(posthtmlCustomElements())
  .use(minifier(minifierOptions))
  .process(fs.readFileSync(source), { sync: true })
  .html

  const template = Handlebars.compile(postResult);
  const data = JSON.parse(fs.readFileSync(__dirname+'/index.html.json').toString());
  const hbsResult = template(data);

  //console.log(result)
  const sourcename = path.basename(source);
  const basename = path.basename(source, '.src.html');
  const dirname = path.dirname(source);
  const destination = path.join(dirname , basename + '.html' )
  fs.writeFileSync(destination, hbsResult + `\n\n <!-- view source of: ${sourcename} -->\n`);

}

function updateCss(source){
  const synthwave = require('./index.js');
  const result = synthwave.css(/[a-z]/);
  fs.writeFileSync(path.join(__dirname, 'style.css'), result);
}

function updateJs(source){
  const synthwave = require('./index.js');
  const result = synthwave.css(/[a-z]/);
  fs.writeFileSync(path.join(__dirname, 'style.css'), result);
}

watch.watchTree(__dirname, {filter: function(source){ return source.match(/\.src\.html$/) }, ignoreDirectoryPattern:/node_modules/}, function (f, curr, prev) {
  if (typeof f == "object" && prev === null && curr === null) {
    // Finished walking the tree
    //console.log( f );
    console.log(chalk.yellow( 'HTML Watcher is monitoring:' ));
    console.log(chalk.yellow( Object.keys(f).filter(i=>i.match(/\.src\.html$/)).join('\n') ));
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
watch.watchTree(__dirname, {filter: function(source){ return source.match(/^style\.json$/) }, ignoreDirectoryPattern:/node_modules/}, function (f, curr, prev) {
  if (typeof f == "object" && prev === null && curr === null) {
    // Finished walking the tree
    //console.log( f );
    console.log(chalk.yellow( 'JSON Watcher is monitoring:' ));
    console.log(chalk.yellow( Object.keys(f).filter(i=>i.match(/^style\.json$/)).join('\n') ));
    console.log(chalk.yellow( '' ));
    Object.keys(f).filter(i=>i.match(/^style\.json$/)).map(i=>updateCss(i));

  } else if (prev === null) {
    // f is a new file
    updateCss(f);

  } else if (curr.nlink === 0) {

    // f was removed
    // do nothing updateCss(f);
    // user is expected to cleanup

  } else {
    // f was changed
    updateCss(f);
  }
})




const Bundler = require('parcel-bundler');


// Entrypoint file location

function updateJs(source){



  const sourcename = path.basename(source);
  const basename = path.basename(source, '.src.js');
  const dirname = path.dirname(source);
  const destination = path.join(dirname , basename + '.js' )

  // console.log( 'SOURCE: %s', source );
  // console.log( '  DEST: %s', destination );

  const options = {
    outDir: '.', // The out directory to put the build files in, defaults to dist
    outFile: destination, // The name of the outputFile

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
watch.watchTree(__dirname, {filter: function(source){ return source.match(/\.src\.js$/) }, ignoreDirectoryPattern:/node_modules/}, function (f, curr, prev) {
  if (typeof f == "object" && prev === null && curr === null) {
    // Finished walking the tree
  //  console.log( f );
    console.log(chalk.yellow( 'JS Watcher is monitoring:' ));
    console.log(chalk.yellow( Object.keys(f).filter(i=>i.match(/\.src\.js$/)).join('\n') ));
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

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({2:[function(require,module,exports) {
var project = require("./index.js");
//const screenfull = require("screenfull");
var nameExpression = new RegExp('^' + project.metadata.name + '-[a-z]$');

$(function () {
  function renderSynthwave(_ref) {
    var selectedLetter = _ref.selectedLetter,
        directedLetter = _ref.directedLetter,
        selectedClassName = _ref.selectedClassName,
        directedClassName = _ref.directedClassName;

    $('#demo-body').removeClass(selectedClassName).addClass(directedClassName);
    $('selected-letter').text(directedLetter);
    $('.css-code').html(project.css(directedLetter));
  }
  function trapNumber(value, min, max) {
    if (value > max) value = min;
    if (value < min) value = max;
    return value;
  }
  function getLetter(magic) {
    var selectedClassName = $('#demo-body').attr('class').split(' ').filter(function (c) {
      return c.match(nameExpression);
    })[0] || project.metadata.name + '-' + 'a';
    var selectedLetter = selectedClassName.split('-')[1];
    var directedLetterNumber = trapNumber(selectedLetter.charCodeAt(0) + magic, 97, 122);
    var directedLetter = String.fromCharCode(directedLetterNumber);
    var directedClassName = project.metadata.name + '-' + directedLetter;
    var response = { selectedLetter: selectedLetter, directedLetter: directedLetter, selectedClassName: selectedClassName, directedClassName: directedClassName };
    return response;
  }

  //$('#full-screen').on('click', ()=>screenfull.enabled?screenfull.request():"");
  $('#aziz-light').on('click', function () {
    return $('.primary.container').toggleClass('bg-dark').toggleClass('shadow-lg');
  });
  $('#prev-wave').on('click', function () {
    return renderSynthwave(getLetter(-1));
  });
  $('#next-wave').on('click', function () {
    return renderSynthwave(getLetter(1));
  });

  renderSynthwave(getLetter(0));
});
},{"./index.js":2}]},{},[2], null)
//# sourceMappingURL=index.map
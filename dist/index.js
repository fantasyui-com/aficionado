"use strict";

var project = require("nightfall");
var screenfull = require("screenfull");

$(function () {

  // console.log(project)
  // $('#demo-body').addClass(`${project.metadata.name}-a`)
  var nameExpression = new RegExp('^' + project.metadata.name + '-[a-z]$');

  function renderSynthwave(_ref) {
    var selectedLetter = _ref.selectedLetter,
        directedLetter = _ref.directedLetter,
        selectedClassName = _ref.selectedClassName,
        directedClassName = _ref.directedClassName;

    $('#demo-body').removeClass(selectedClassName).addClass(directedClassName);
    $("selected-letter").text(directedLetter);
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

  // $('#full-screen').on('click', ()=>screenfull.enabled?screenfull.request():"");
  // $('#aziz-light').on('click', ()=>$('.primary.container').toggleClass('bg-dark').toggleClass('shadow-lg'));
  // $('#prev-wave').on('click', ()=>renderSynthwave(getLetter(-1)));
  // $('#next-wave').on('click', ()=>renderSynthwave(getLetter(1)));

  // renderSynthwave(getLetter(0));
});
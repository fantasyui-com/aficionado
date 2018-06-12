
const project = require("nightfall");
const screenfull = require("screenfull");

$(function() {

  // console.log(project)
  // $('#demo-body').addClass(`${project.metadata.name}-a`)
  const nameExpression = new RegExp('^'+project.metadata.name+'-[a-z]$');

  function renderSynthwave({selectedLetter, directedLetter, selectedClassName, directedClassName}) {
    $('#demo-body').removeClass(selectedClassName).addClass(directedClassName);
    $(`selected-letter`).text(directedLetter);
    $('.css-code').html( project.css(directedLetter) );
  }
  function trapNumber(value, min, max){
    if (value > max) value = min;
    if (value < min) value = max;
    return value;
  }
  function getLetter(magic) {
    let selectedClassName = $('#demo-body').attr('class').split(' ').filter((c)=>c.match(nameExpression))[0]||(project.metadata.name+'-'+'a');
    let selectedLetter = selectedClassName.split('-')[1];
    let directedLetterNumber = trapNumber(selectedLetter.charCodeAt(0) + magic, 97, 122);
    let directedLetter = String.fromCharCode(directedLetterNumber);
    let directedClassName = project.metadata.name + '-' + directedLetter;
    let response = { selectedLetter, directedLetter, selectedClassName, directedClassName };
    return response;
  }

  // $('#full-screen').on('click', ()=>screenfull.enabled?screenfull.request():"");
  // $('#aziz-light').on('click', ()=>$('.primary.container').toggleClass('bg-dark').toggleClass('shadow-lg'));
  // $('#prev-wave').on('click', ()=>renderSynthwave(getLetter(-1)));
  // $('#next-wave').on('click', ()=>renderSynthwave(getLetter(1)));

  // renderSynthwave(getLetter(0));
});

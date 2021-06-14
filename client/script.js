"use strict"
/*  Код касающийся сервисной и интерфейсной части  */
document.addEventListener("DOMContentLoaded", function(event){
  function elHasNeedClass(lineClasses, className){
    return (lineClasses.indexOf(className, 0) !== -1)? true : false;
  }
  //сворачиваем левую панель
  const clickButtonLeftRight = document.getElementById('idRollUp-ButtonLeftRight');
  clickButtonLeftRight.addEventListener('click', function() {
    console.log('сворачиваем левую панель');
    const elem = document.querySelector('.arrow-left-right');
    elem.classList.toggle('_active');
    const elemNeedHide = document.querySelector('.showcase__left-content');
    elemNeedHide.classList.toggle('_hide');
    let elemBasisValue = document.querySelector('.showcase__panel_left');
    elemBasisValue.style.flexBasis = (elHasNeedClass(elemNeedHide.className,'_hide'))?'0':'100%';
  });
  //сворачиваем верхнюю панель 
  const clickButtonHeaderUpDown = document.getElementById('idRollUp-ButtonHeader-UpDown');
  clickButtonHeaderUpDown.addEventListener('click', function() {
    console.log('сворачиваем верхнюю панель');
    const elem = document.querySelector('.arrow-header-updown');
    elem.classList.toggle('_active');
    const elemNeedHide = document.querySelector('.showcase__header-content');
    elemNeedHide.classList.toggle('_hide');
  });
  //сворачиваем верхнюю панель 
  const clickButtonFooterUpDown = document.getElementById('idRollUp-ButtonFooter-UpDown');
  clickButtonFooterUpDown.addEventListener('click', function() {
    console.log('сворачиваем нижнюю панель');
    const elem = document.querySelector('.arrow-footer-updown');
    elem.classList.toggle('_active');
    const elemNeedHide = document.querySelector('.showcase__footer-content');
    elemNeedHide.classList.toggle('_hide');
  });
})

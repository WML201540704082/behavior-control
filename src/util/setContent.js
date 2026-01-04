// 设置内容高度
export function setPageContentHeight(formName, bodyName, isXtPage, myVal=0) {
  let formClass = formName? formName : 'page_form'
  let bodyClass = bodyName? bodyName : 'page_body'
  let avueMain = document.getElementsByClassName('avue-main')
  let pageForm = document.getElementsByClassName(formClass)
  let pageBody = document.getElementsByClassName(bodyClass)
  if(isXtPage) pageBody[0].style.height = avueMain[0].offsetHeight - 56 - 5 - myVal - pageForm[0].offsetHeight + 'px'
  else pageBody[0].style.height = avueMain[0].offsetHeight - 56 - 25 - myVal - pageForm[0].offsetHeight + 'px'
  
  return
}
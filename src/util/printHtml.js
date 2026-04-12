// 打印
export default function printHtml(html) {
  // let style2 = getStyle2()
  let style = getStyle()
  let container = getContainer(html)
  // document.head.appendChild(style2)
  document.body.appendChild(style)
  document.body.appendChild(container)
  window.print()
  document.body.removeChild(style)
  document.body.removeChild(container)
  // getStyle2.remove()
}

function getStyle() {
  let styleContent = `
    #print-container{
      display: none;
      padding: 20px;
    }
   
    @media print{
      body > :not(.print-container) {
        display: none;
      }
      html, body{
        display: block!important;
      }
      #print-container{
        display: block!important;
      }
      @page{ margin: 0}
      
    }
  `
  let style = document.createElement("style")
  style.innerHTML = styleContent

  return style
}
// function getStyle2() {
//   let style2 = document.createElement("style")
//   style2.innerHTML = `
//     @page{ margin: 0}
//     body {
//       ma
//     }
//   `
//   return style2
// }


function getContainer(html) {
  let container = document.createElement("div")
  container.setAttribute("id", "print-container")
  container.innerHTML = html
  return container
}

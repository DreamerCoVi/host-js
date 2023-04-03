const OPENED = true
const CLOSED = false

const styles = `
.by-widget {
    display: block;
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    transition: .3s;
}

.by-widget-opened {
    opacity: 1;
    width: 500px;
    transition: .3s;
    overflow: hidden
}

.by-widget-closed {
    opacity: 0;
    width: 0px;
    transition: .3s;
    overflow: hidden;
    pointer-events: none; 
}

.by-widget-closed >
.by-widget__backdrop {
    display: none
}

.by-widget__backdrop {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,.6);
  zIndex: 998
}


.by-widget__inner {
    opacity: 1;
    width: 500px;
    min-width: 500px;
    max-width: 500px;
    transition: .3s;
    z-index: 999;
    background: white;
    position: fixed;
    right: 0!important;
    top: 0!important;
    height: 100vh;
}

.by-widget__iframe {
  width: 100% !important;
  height: 100% !important;
  box-sizing: border-box !important;
}
`

class BWidget {
  options = {
    primaryColor: '',
    activeAnimation: true,
    buttonPlacement: 'right-bottom',
    buttonColor: 'rgb(255, 102, 102)',
    overlayPlacement: 'right',
  }
  
  uuid = ''

  makeBackdrop(){
    const backdrop = document.createElement('div')
    backdrop.classList.add('by-widget__backdrop')
    backdrop.onclick = () => {
        document.getElementById("by-widget").classList.replace('by-widget-opened', 'by-widget-closed')
    }

    return backdrop
  }

  makeIFrame(){
    const iframe = document.createElement('iframe')

    iframe.classList.add('by-widget__iframe')

    iframe.setAttribute('frameborder', "0")
    iframe.setAttribute('allowtransparency', "true")
    iframe.setAttribute('src', 'http://localhost:3000/widget')

    return iframe
  }

  makeCollapsedWidget(state){
    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'by-widget')
    wrapper.classList.add('by-widget')
    wrapper.classList.add(state ? 'by-widget-opened' : 'by-widget-closed')
    
    const inner = document.createElement('div')
    inner.classList.add('by-widget__inner')

    inner.appendChild(this.makeIFrame())

    wrapper.appendChild(inner)

    const backdrop = this.makeBackdrop()
    wrapper.appendChild(backdrop)


    return {wrapper, backdrop}
  }

  makeStyles() {
    const ss = document.createElement('style')
    ss.innerText = styles
    document.head.appendChild(ss)
  }

  makeButton(){
    if(!window.location.pathname.includes('widget')){
      this.makeStyles()
      const body = document.body

      const button = document.createElement('button')
      button.setAttribute('id', 'bwidget-button')
      button.appendChild(document.createTextNode('Бронь'))

      button.style.position = 'absolute'
      button.style.bottom = '64px'
      button.style.right = '64px'
      button.style.borderRadius = '100%'
      button.style.width = '100px'
      button.style.height = '100px'
      button.style.fontSize = '16px'
      button.style.fontWeight = '600'
      button.style.cursor = 'pointer'
      button.style.border = 'none'
      button.style.background = '#FF6666'
      button.style.color = "white"

      button.animate({
          boxShadow: [ '0 0 0 0 rgb(255, 102, 102, .8)', '0 0 0 20px rgba(255, 102, 102, 0)', '0 0 0 0 rgba(255, 102, 102, 0)' ],
        }, {
          duration: 2000,
          iterations: Infinity
        })

      const toggleWidget = () => {
          const collapseWidget = document.getElementById("by-widget")
          if(collapseWidget){
              if(collapseWidget.classList.contains('by-widget-opened')){
                  collapseWidget.classList.replace('by-widget-opened', 'by-widget-closed')
              }else{
                  collapseWidget.classList.replace('by-widget-closed','by-widget-opened')
              }            
          }else{
              const {wrapper} = this.makeCollapsedWidget(OPENED)
              
              body.appendChild(wrapper)
          }
      }

      button.onclick = toggleWidget      

      body.appendChild(button)
    }
  }

  cleanButton(){
    const button = document.getElementById('bwidget-button')
    const widget = document.getElementById('by-widget')
    if(button) button.remove()
    if(widget) widget.remove()
  }

  async init(uuid='e4beb2c6-41d9-4994-a848-f4529cc72a44'){
    this.cleanButton()
    const resp = await fetch(`http://d9.tripvenue.ru/booking-form/${uuid}/widgetJS`)
    this.makeButton()
  }
}

window.__BWidget = new BWidget()

window.onload = () => {
  window.__BWidget.init()
}

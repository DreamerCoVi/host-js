const OPENED = true
const CLOSED = false

const styles = `
.by-widget {
    display: block;
    position: fixed;
    height: 100vh;
    transition: .3s;
}

.by-widget-opened {
    opacity: 1;
    z-index: 999;
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
    height: 100vh;
}

.by-widget__iframe {
  width: 100% !important;
  height: 100% !important;
  box-sizing: border-box !important;
}
`

class BWidget {
  config = null  
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
    iframe.setAttribute('src', `http://${this.config?.slug ? this.config.slug + '.' : ''}localhost:3000/widget`)

    return iframe
  }

  setWidgetPosition(wrapper){
    const position = this.config?.overlayPlacement || 'right'
    wrapper.style.top = 0
    if(position) wrapper.style[position] = 0
  }

  setInnerPosition(inner){
    const position = this.config?.overlayPlacement || 'right'
    inner.style.top = 0
    if(position) inner.style[position] = 0
  }

  makeCollapsedWidget(state){
    const wrapper = document.createElement('div')
    wrapper.setAttribute('id', 'by-widget')
    wrapper.classList.add('by-widget')
    wrapper.classList.add(state ? 'by-widget-opened' : 'by-widget-closed')
    
    const inner = document.createElement('div')
    inner.classList.add('by-widget__inner')

    this.setInnerPosition(inner)

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

  hex2rgba(hex, alpha = 1) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
  }

  setButtonPosition(button){
    const placement = this.config?.placement
    if(placement){
      if(placement.includes('right')) button.style.right = '64px'
      if(placement.includes('top')) button.style.top = '64px'
      if(placement.includes('left')) button.style.left = '64px'
      if(placement.includes('bottom')) button.style.bottom = '64px'
    }else{      
      button.style.bottom = '64px'
      button.style.right = '64px'
    }
  }

  makeButton(){
    if(!window.location.pathname.includes('widget')){
      this.makeStyles()
      const body = document.body

      const button = document.createElement('button')
      button.setAttribute('id', 'bwidget-button')
      button.appendChild(document.createTextNode('Бронировать'))
      this.setButtonPosition(button)

      const defaultColor = '#FF6666'

      button.style.position = 'absolute'
      button.style.borderRadius = '100%'
      button.style.width = '100px'
      button.style.height = '100px'
      button.style.fontSize = '13px'
      button.style.fontWeight = '600'
      button.style.cursor = 'pointer'
      button.style.border = 'none'
      button.style.zIndex = 3
      button.style.background = this.config?.buttonColor || defaultColor
      button.style.color = "white"

      if(!this.config || this.config?.showAnimation){
        button.animate({
          boxShadow: [ `0 0 0 0 ${this.hex2rgba(this.config?.buttonColor || defaultColor, 0.8)}`, `0 0 0 20px ${this.hex2rgba(this.config?.buttonColor || defaultColor, 0)}`, `0 0 0 0 ${this.hex2rgba(this.config?.buttonColor || defaultColor, 0)}` ],
        }, {
          duration: 2000,
          iterations: Infinity
        })
      }

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

  async init(param='e4beb2c6-41d9-4994-a848-f4529cc72a44'){
    this.cleanButton()
    if(typeof param === 'string'){
      const resp = await fetch(`http://d9.tripvenue.ru/booking-form/${param}/widgetJS`)
    }
    if(typeof param === 'object'){/* если прокинули конфиг */
      this.config = param
    }   
    console.log('this.config', this.config)
    this.makeButton()
  }
}

window.__BWidget = new BWidget()

if(document.readyState === 'complete'){
  /* window.__BWidget.init() */
}

window.onload = () => {
  window.__BWidget.init()
}

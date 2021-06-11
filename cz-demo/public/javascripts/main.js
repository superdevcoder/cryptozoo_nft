;(function(){

  class ConfirmBox {
    constructor(txt, resolve){
      this.elem = document.createElement('div')
      this.elem.className = 'modal dialog-box'
      this.resolveFn = resolve
      this.elem.innerHTML = `
        <h3>${txt}</h3>
        <div style="display: flex;">
          <a class="formbutton">Yes</a>
          <a class="formbutton">No</a>
        </div>
        <div class="modal-close"></div>
      `

      const closeButton = this.elem.querySelector('.modal-close')
      if(closeButton){
        closeButton.addEventListener('click', () => {
          this.resolveFn(null)
          this.close()
        })
      }

      const submitButtons = this.elem.querySelectorAll('.formbutton')
      submitButtons[0].addEventListener('click', () => {
        this.resolveFn(true)
        this.close()
      })
      submitButtons[1].addEventListener('click', () => {
        this.resolveFn(null)
        this.close()
      })

      document.body.appendChild(this.elem)
    }
    close(){
      this.elem.remove()
    }
  }

  window.quickConfirm = (txt) => {
    return new Promise(resolve => {
      new ConfirmBox(txt, resolve)
    })
  } 

  class DialogBox {
    constructor(txt, fields, resolve, cta = "Submit"){ // fields { name: type, }
      this.elem = document.createElement('div')
      this.elem.className = 'modal dialog-box'
      this.fieldNames = Object.keys(fields)
      this.resolveFn = resolve
      this.elem.innerHTML = `
        <h3>${txt}</h3>
        ${this.fieldNames.map(fieldName => {
          const obj = fields[fieldName],
            type = obj.type || 'text',
            defaultval = obj.default ? `value="${obj.default}"` : ''
          return `
          <div class="formfield">
            <label>${obj.label || fieldName}</label>
            <input name="${fieldName}" type="${type}" ${defaultval} />
          </div>
        `}).join('')}
        <a class="formbutton">${cta}</a>
        <div class="modal-close"></div>
      `

      const closeButton = this.elem.querySelector('.modal-close')
      if(closeButton){
        closeButton.addEventListener('click', () => {
          this.resolveFn(null)
          this.close()
        })
      }

      const submitButton = this.elem.querySelector('.formbutton')
      submitButton.addEventListener('click', () => {
        const data = this.fieldNames.reduce((obj, fieldName) => {
          const val = this.elem.querySelector(`[name="${fieldName}"]`).value
          obj[fieldName] = val
          return obj
        }, {})

        this.resolveFn(data)
        this.close()
      })

      document.body.appendChild(this.elem)
    }
    close(){
      this.elem.remove()
    }
  }

  window.quickFormPromise = (txt, fields, cta) => {
    return new Promise(resolve => {
      new DialogBox(txt, fields, resolve, cta)
    })
  } 

  //Endpoint manager
  class _EndpointManager {
    constructor(){
      this.endpoints = {}
    }

    //private methods
    async _handleResponse(response){
      if (!response.ok) {
        return {
          error: {
            status: response.status,
            message: response.statusText
          }
        }
      } else {
        const resp = await response.json()
        let obj
        if(typeof resp === "object") obj = resp
        else obj = JSON.parse(resp)
        
        return obj;
      }
    }

    //public methods
    async delete(url, data){
      const body = typeof data === "string" ? data : JSON.stringify(data),
        response = await fetch(url, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        cache: 'no-cache',
        body
      })
      return this._handleResponse(response)
    }

    async get(url){
      const response = await fetch(url)
      return this._handleResponse(response)
    }

    async post(url, data = ""){
      const body = typeof data === "string" ? data : JSON.stringify(data),
        response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        cache: 'no-cache',
        body
      })
      return this._handleResponse(response)
    }

    async put(url, data){
      const body = typeof data === "string" ? data : JSON.stringify(data),
        response = await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        cache: 'no-cache',
        body
      })
      return this._handleResponse(response)
    }

    getParameterizedEndpoint(name, data){
      const url = this.endpoints[name].urlBuilder(data)
      return this.get(url)
    }

    registerParameterizedEndpoint(name, urlBuilder){
      this.endpoints[name] = {
        urlBuilder
      }
    }
  }

  window.EndpointManager = new _EndpointManager()

  window.modals = {}

  class Modal {
    constructor(elem){
      this.elem = elem
      this.name = this.elem.dataset.modalName

      window.modals[this.name] = this

      document.querySelectorAll(`.modal-trigger[data-modal-name="${this.name}"]`).forEach(elem => {
        elem.addEventListener('click', () => this.open())
      })

      const closeButton = this.elem.querySelector('.modal-close')
      if(closeButton){
        closeButton.addEventListener('click', () => this.close())
      }
    }
    close(){
      this.elem.classList.add('hidden')
    }
    open(){
      this.elem.classList.remove('hidden')
    }
  }

  //forms
  const formCallbacks = {
    login: function(data){
      console.log(data)
      window.modals.login.close()
      localStorage.czUser = JSON.stringify(data.user)
      location.href = '/feed'
    },
    register: function(data){
      window.modals.register.close()
      localStorage.czUser = JSON.stringify(data.user)
      location.href = '/feed'
    }
  }

  class Form {
    constructor(elem){
      this.elem = elem
      this.action = elem.dataset.action
      this.method = elem.dataset.method
      this.callback = formCallbacks[elem.dataset.cbKey]

      this.elem.querySelector('.formbutton').addEventListener('click', () => {
        let isOK = true
        const data = Array.from(this.elem.querySelectorAll('.formfield input')).reduce((obj, field) => {
          const val = field.value.trim()
          if(!val.length && field.required) {
            isOK = false
          }
          obj[field.name] = val
          return obj
        }, {})

        if(isOK){
          window.EndpointManager[this.method.toLowerCase()](this.action, data).then(resp => {
            if(resp.error) {
              alert(resp.error)
            } else {
              this.callback(resp)
            }
          })
        }
      })
    }
  }

  document.querySelectorAll('.modal').forEach(elem => new Modal(elem))

  document.querySelectorAll('.js-form').forEach(elem => new Form(elem))
}());
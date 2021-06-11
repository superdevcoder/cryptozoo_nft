const rootelem = document.documentElement
function calculateHeight(){
  rootelem.style.setProperty('--vh', [rootelem.clientHeight / 100, 'px'].join(''))
}

calculateHeight()
window.addEventListener('resize', calculateHeight)

class MiniCart {
  constructor(parent, icon){
    this.api_urls = {
      get: `${window.location.origin}/cart.js`,
      update: `${window.location.origin}/cart/update.js`
    }

    this.state = {}

    const elem = document.createElement('div')
    elem.id = "MiniCart"
    elem.className = 'minicart'

    elem.innerHTML = `
      <div id="MiniCart__header">
        <img src="${CART_ICON_URL}" alt="Cart" />
        <h1>Cart</h1>
      </div>
      <div id="MiniCart__empty">
        <h2>Your cart is currently empty</h2>
      </div>
      <div id="MiniCart__items">

      </div>
      <div id="MiniCart__summary">

      </div>
    `

    parent.appendChild(elem)

    this.elems = {
      main: elem,
      icon,
      header: document.getElementById('MiniCart__header'),
      empty: document.getElementById('MiniCart__empty'),
      items: document.getElementById('MiniCart__items'),
      summary: document.getElementById('MiniCart__summary')
    }

    this.getCart()

    this.addEvents()
  }

  addEvents(){
    this.elems.main.addEventListener('click', e => {
      const tgt = e.target.closest('.cart-js')
      if(tgt){
        switch (tgt.dataset.action) {
          case 'set item quantity':
            this.updateItemQuantity(tgt.dataset.productId, tgt.dataset.quantity)
            break;
          case 'remove item':
            this.removeItem(tgt.dataset.productId)
            break;
        }
      }
    })
  }

  _api(data){
    if(data){
      //post
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }
      return fetch(this.api_urls.update, options).then(resp => resp.json())
    }
    //else get
    return fetch(this.api_urls.get).then(resp => resp.json())
  }
  addItem(productId){
    this.updateItemQuantity(productId, 1)
  }
  removeItem(productId){
    this.updateItemQuantity(productId, 0)
  }
  updateItemQuantity(productId, quantity){
    const updates = {}
    updates[productId] = quantity
    this.updateItems({
      updates
    })
  }
  updateItems(body){
    this._api(body).then(data => {
      this.state = data
      this.renderCart()
      this.open()
    })
  }
  getCart(){
    this._api().then(data => {
      this.state = data
      this.renderCart()
    })
  }

  emptyCart(){
    
  }

  renderCart(){
    if(this.state.items.length){
      this.elems.main.dataset.state = "has items"
      this.elems.items.innerHTML = this.state.items.map(item => `
        <div class="MiniCart__item" data-product-id="${item.id}">
          <div class="MiniCart__item-image" style="background-image: url(${item.featured_image.url})"></div>
          <div class="MiniCart__item-details">
            <h3 class="MiniCart__item-details__title">${item.title}</h3>
            <h4 class="MiniCart__item-details__price">${formatPrice(item.price)}</h4>
            <div class="MiniCart__item-details__row MiniCart__item-details__quantity">
              <label>Quantity: </label>
              ${item.quantity > 1 ? `<a class="MiniCart__item-details__quantity-button cart-js" data-action="set item quantity" data-quantity="${item.quantity - 1}" data-product-id="${item.id}">-</a>` : '<span class="MiniCart__item-details__quantity-placeholder">&nbsp;</span>'}
              <span class="MiniCart__item-details__quantity-count">${item.quantity}</span>
              <a class="MiniCart__item-details__quantity-button cart-js" data-action="set item quantity" data-quantity="${item.quantity + 1}" data-product-id="${item.id}">+</a>
            </div>
            <a class="MiniCart__item-details__remove cart-js" data-action="remove item" data-product-id="${item.id}">Remove Item</a>
          </div>
        </div>
      `)

      this.elems.summary.innerHTML = `
        <div class="MiniCart__summary-row">
          <label>Subtotal</label>
          <span>$${formatPrice(this.state.total_price)}</span>
        </div>
        <a id="MiniCart__checkout-button" href="/checkout">Checkout</a>
      `

      this.elems.icon.classList.add('-has-items')
      this.elems.icon.setAttribute('data-item-count', this.state.items.length)
    } else {
      this.elems.main.dataset.state = "empty"
      this.elems.items.innerHTML = ''
      this.elems.summary.innerHTML = ''
      
      this.elems.icon.classList.remove('-has-items')
      this.elems.icon.removeAttribute('data-item-count')
    }
  }

  close(){
    this.elems.main.classList.remove('-show')
    this.isOpen = false
  }
  open(){
    this.elems.main.classList.add('-show')
    this.isOpen = true
  }
  toggle(){
    this.elems.main.classList.toggle('-show')
    this.isOpen = !this.isOpen
  }
}

class ZooFeed {
  constructor(elem, dataset){
    this.feedSize = 0

    this.makeFilterChange = false //set this to true when a user edits the filters

    this.filterOptions = [
      {
        name: 'recent',
        icon_key: 'retweet'
      },
      {
        name: 'travel',
        icon_key: 'globe'
      }, {
        name: 'beauty',
        icon_key: 'eye'
      }, {
        name: 'fitness',
        icon_key: 'heartbeat'
      }
    ]
    
    elem.classList.add('sv')

    this.currentPage = null

    this.elems = {
      main: elem,
      user: elem.querySelector('.sv__info-user'),
      description: elem.querySelector('.sv__info-description'),
      feed: elem.querySelector('.sv__feed'),
      popupsParent: elem.querySelector('.sv__popups'),
      popupContentLookup: Array.from(elem.querySelectorAll('.sv__popups-popup')).reduce((obj, t) => {
        obj[t.dataset.name] = t.querySelector('.sv__popups-popup__inner')
        return obj
      }, {}),
      buttonLookup: Array.from(elem.querySelectorAll('.sv__buttons-button')).reduce((obj, t) => {
        obj[t.dataset.name] = t
        return obj
      }, {}),
      filterParent: elem.querySelector('.sv__filter'),
      filterDisplay: elem.querySelector('.sv__filter-current'),
      filterOptions: elem.querySelector('.sv__filter-options')
    }

    if(this.elems.filterParent){
      this.filterLists = Array.from(elem.querySelectorAll('.sv__filter-list')).reduce((obj, t) => {
        const filterobj = {
          elem: t,
          options: [],
          type: t.dataset.type
        }
        if(t.dataset.type === "single"){
          filterobj.active_option = null
        } else {
          filterobj.active_options = []
        }
        obj[t.dataset.filter] = filterobj
        return obj
      }, {})
    }

    this.initialFeedY = null
    this.initialY = null
    this.swipeThreshold = 120
    this.idx = 0

    //set up data and filters
    this.base_dataset = dataset.map(post => {
      //populate tags
      if(post.tags){
        post.tags = post.tags.map(_tag => {
          const tag = _tag.indexOf('|') > -1 ? _tag.split('|')[1] : _tag
          if(tag && this.filterLists.tags.options.indexOf(tag) === -1){
            this.filterLists.tags.options.push(tag)
          }

          return tag
        });
      }

      //populate other filters
      ['animal_name'].forEach(key => {
        if(post[key] && this.filterLists[key].options.indexOf(post[key]) === -1){
          this.filterLists[key].options.push(post[key])
        }
      })
      
      return post
    })
    this.active_dataset = this.base_dataset.slice(0)
    this.filter_preview_dataset = null //this will be used in the filtering flow
    
    Object.keys(this.filterLists).forEach(key => {
      const filterObj = this.filterLists[key]

      filterObj.elem.innerHTML = filterObj.options.map(option => {
        return `<li class="sv__filter-option sv-js" data-action="add filter" data-type="${filterObj.type}" data-filter-name="${key}" data-val="${option}">
          <span>${option}</span>
        </li>`
      }).join('')
    })

    //set up cart
    //this.cart = new MiniCart(elem, this.elems.buttonLookup.cart)
    this.cart = {}

    this.addEvents()

    const urlParams = getURLParams()

    this.state = urlParams.state ? JSON.parse(atob(urlParams.state)) : {
      id: null,
      filters: null
    }

    this.filterPosts(this.state.id)
  }

  openFilterMenu(){
    this.elems.filterParent.classList.add('-open')
  }
  closeFilterMenu(){
    this.elems.filterParent.classList.remove('-open')
    
    if(this.makeFilterChange){
      this.makeFilterChange = false
      this.filterPosts()
    }
  }

  addFilter(tgt){
    if(!this.state.filters){
      this.state.filters = {}
    }
    const parent = tgt.parentElement
    if(parent.classList.contains('sv__filter-type-single')){
      const currentActiveFilter = tgt.parentElement.querySelector('.-active')
      if(currentActiveFilter) {
        currentActiveFilter.classList.remove('-active')
      }
      this.state.filters[tgt.dataset.filterName] = tgt.dataset.val
    } else {
      //multi
      if(!this.state.filters[tgt.dataset.filterName]){
        this.state.filters[tgt.dataset.filterName] = []
      }
      this.state.filters[tgt.dataset.filterName].push(tgt.dataset.val)
    }
    tgt.classList.add('-active')
    tgt.setAttribute('data-action', 'remove filter')
  }

  removeFilter(tgt){
    const { type, filterName, val } = tgt.dataset
    if(type === 'single'){
      delete this.state.filters[filterName]
    } else {
      //multi
      this.state.filters[filterName] = this.state.filters[filterName].filter(t => t !== val)
      if(!this.state.filters[filterName].length){
        delete this.state.filters[filterName]
      }
    }
    //if no filters are applied at this point, set the object to null
    if(!Object.keys(this.state.filters).length){
      this.state.filters = null
    }

    tgt.classList.remove('-active')
    tgt.setAttribute('data-action', 'add filter')
  }

  updateFilterPreviewDataset(){
    this.filter_preview_dataset = this.base_dataset.slice(0)

    if(this.state.filters){
      Object.keys(this.state.filters).forEach(key => {
        const filterObj = this.filterLists[key]
        if(filterObj.type === 'single'){
          this.filter_preview_dataset = this.filter_preview_dataset.filter(post => {
            return post[key] === this.state.filters[key]
          })
        } else {
          //multi
          const arr = this.state.filters[key]
          this.filter_preview_dataset = this.filter_preview_dataset.filter(post => {
            let i = arr.length
            while(--i > -1){
              //if any of the multiselect fields match, the post passes
              if(post[key].indexOf(arr[i]) > -1){
                return true
              }
            }
            return false
          })
        }
      })

      Object.keys(this.filterLists).forEach(key => {
        const filterObj = this.filterLists[key]
        if(filterObj.type === 'single'){
          filterObj.available_options = this.filter_preview_dataset.reduce((arr, post) => {
            const val = post[key]
            if(arr.indexOf(val) === -1){
              arr.push(val)
            }
            return arr
          }, [])
        } else {
          //multi
          filterObj.available_options = this.filter_preview_dataset.reduce((arr, post) => {
            const vals = post[key]
            vals.forEach(val => {
              if(arr.indexOf(val) === -1){
                arr.push(val)
              }
            })          
            return arr
          }, [])
        }
      })
    } else {
      Object.keys(this.filterLists).forEach(key => {
        const filterObj = this.filterLists[key]
        filterObj.available_options = filterObj.options.slice(0)
      })
    }

    this.elems.filterOptions.querySelectorAll('.sv__filter-option').forEach(t => {
      const filterObj = this.filterLists[t.dataset.filterName]
      if(filterObj.available_options.indexOf(t.dataset.val) === -1){
        //filter is unavailable
        t.classList.add('hidden')

        if(t.classList.contains('-active')){
          this.removeFilter(t)
        }
      } else {
        t.classList.remove('hidden')
      }
    })
  }

  addEvents(){
    this.elems.main.addEventListener('click', e => {
      //always close cart if clicking outside of it
      if(this.cart.isOpen && !e.target.closest('#MiniCart') && !e.target.closest('.sv__buttons-cart')){
        this.cart.close()
      }

      const tgt = e.target.closest('.sv-js')
      if(tgt){
        switch (tgt.dataset.action){
          case "add to cart":
            this.cart.addItem(tgt.dataset.variantId)
            break;
          case "set variant":
            tgt.parentElement.querySelector('.-selected').classList.remove('-selected')
            tgt.classList.add('-selected')
            tgt.closest('.sv__shop-product').querySelector('.sv__shop-product__add-to-cart').dataset.variantId = tgt.dataset.variantId
            break;
          case "open popup":
            this.openPopup(tgt.dataset.name)
            break;
          case "close popup":
            //only fire this if it's a click on the container itself
            if(tgt === e.target){
              this.closePopup()
            }
            break;
          case "toggle filters":
            if(this.elems.filterParent.classList.contains('-open')){
              this.closeFilterMenu()
            } else {
              this.openFilterMenu()
            }
            break;
          case "apply filters":
            this.closeFilterMenu()
            break;
          case "clear filters":
            this.state.filters = null
            this.elems.filterOptions.querySelectorAll('.sv__filter-option').forEach(t => {
              t.classList.remove('-active')
              t.classList.remove('hidden')
              t.setAttribute('data-action', 'add filter')
            })
            this.makeFilterChange = true
            this.closeFilterMenu()
            break;
          case "add filter":
            this.makeFilterChange = true
            this.addFilter(tgt)
            this.updateFilterPreviewDataset()
            break;
          case "remove filter":
            this.makeFilterChange = true
            this.removeFilter(tgt)
            this.updateFilterPreviewDataset()
            break;
          case "show product":
            this.openPopup('shop')
            this.featureProduct(tgt.dataset.productId)
            break;
        }
      }
    })

    /* --- Popup Events ---*/

    //popup swipe events
    this.elems.popupsParent.addEventListener('mousedown', e => {
      const popupY = e.pageY - this.elems.main.offsetTop
      if(!e.target.closest('.sv__popups-popup__inner')){
        this.elems.popupsParent.addEventListener('mouseup', e => {
          const mouseupY = e.pageY - this.elems.main.offsetTop
          if(mouseupY - popupY > 50){
            this.closePopup()
          }
        }, { once: true })
      }
    })

    this.elems.popupsParent.addEventListener('touchstart', e => {
      const popupY = e.changedTouches[0].pageY
      if(!e.target.closest('.sv__popups-popup__inner')){
        this.elems.popupsParent.addEventListener('touchend', e => {
          if(e.changedTouches[0].pageY - popupY > 50){
            this.closePopup()
          }
        }, { once: true })
      }
    })

    this.elems.popupsParent.addEventListener('mousemove', e => {
      if(!e.target.closest('.sv__popups-popup__inner')){
        e.preventDefault()
      }
    })
    this.elems.popupsParent.addEventListener('touchmove', e => {
      if(!e.target.closest('.sv__popups-popup__inner')){
        e.preventDefault()
      }
    })

    //shop popup click
    this.elems.popupContentLookup.shop.addEventListener('click', e => {
      const currentHighlight = this.elems.popupContentLookup.shop.querySelector('.-highlight')
      if(currentHighlight){
        currentHighlight.classList.remove('-highlight')
      }
    })


    /* --- Cart Events ---*/
    //this.elems.buttonLookup.cart.addEventListener('click', e => this.cart.open())

    //cart swipe events
    this.elems.main.addEventListener('mousedown', e => {
      if(this.cart.isOpen){
        const cartX = e.pageX - this.elems.main.offsetLeft
        this.elems.main.addEventListener('mouseup', e => {
          const mouseupX = e.pageX - this.elems.main.offsetLeft
          if(mouseupX - cartX > 50){
            this.cart.close()
          }
        }, { once: true })
      }
    })

    this.elems.main.addEventListener('touchstart', e => {
      if(this.cart.isOpen){
        const cartX = e.changedTouches[0].pageX
        this.elems.main.addEventListener('touchend', e => {
          if(e.changedTouches[0].pageX - cartX > 50){
            this.cart.close()
          }
        }, { once: true })
      }
    })
    
    //filters swipe events
    this.elems.filterParent.addEventListener('mousedown', e => {
      const popupY = e.pageY - this.elems.main.offsetTop
      if(!e.target.closest('#TagsFilter')){
        this.elems.main.addEventListener('mouseup', e => {
          const mouseupY = e.pageY - this.elems.main.offsetTop
          if(mouseupY - popupY < -50){
            this.closeFilterMenu()
          } else if(mouseupY - popupY > 50){
            this.openFilterMenu()
          }
        }, { once: true })
      }
    })

    this.elems.filterParent.addEventListener('touchstart', e => {
      const popupY = e.changedTouches[0].pageY
      if(!e.target.closest('#TagsFilter')){
        this.elems.main.addEventListener('touchend', e => {
          if(e.changedTouches[0].pageY - popupY < -50){
            this.closeFilterMenu()
          } else if(e.changedTouches[0].pageY - popupY > 50){
            this.openFilterMenu()
          }
        }, { once: true })
      }
    })

    //feed swipe events
    this.elems.feed.addEventListener('touchstart', e => {
      //don't start swipe event if clicking on something interactive
      if(!e.target.closest('.sv-js')){
        e.preventDefault();
        this.initialY = e.changedTouches[0].pageY
        this.handleSwipeStart()

        const handleTouchmove = this.handleSwipeMove.bind(this),
          _touchendHandler = this.handleSwipeEnd.bind(this),
          _feedElem = this.elems.feed,
          handleTouchend = function(e){
            const y = e.changedTouches[0].pageY
            _feedElem.removeEventListener('touchmove', handleTouchmove)
            _touchendHandler(y)
          }
        
        this.elems.main.addEventListener('touchend', handleTouchend, { once: true })
        this.elems.feed.addEventListener('touchmove', handleTouchmove)
      }
    });

    this.elems.feed.addEventListener('mousedown', e => {
      if(!e.target.closest('.sv-js')){
        e.preventDefault();
        this.initialY = e.pageY - this.elems.main.offsetTop
        this.handleSwipeStart()

        const handleMousemove = this.handleSwipeMove.bind(this),
          _mouseupHandler = this.handleSwipeEnd.bind(this),
          _feedElem = this.elems.feed,
          handleMouseup = (function(e){
            const y = e.pageY - this.elems.main.offsetTop
            _feedElem.removeEventListener('mousemove', handleMousemove)
            _mouseupHandler(y)
          }).bind(this)
        
        this.elems.main.addEventListener('mouseup', handleMouseup, { once: true })
        this.elems.feed.addEventListener('mousemove', handleMousemove)
      }
    });
  }

  featureProduct(productId){
    const currentActive = this.elems.popupContentLookup.shop.querySelector('.-highlight'),
      productToHighlight = this.elems.popupContentLookup.shop.querySelector(`.sv__shop-product[data-product-id="${productId}"]`)
    if(currentActive){
      currentActive.classList.remove('-highlight')
    }
    productToHighlight.classList.add('-highlight')
    this.elems.popupContentLookup.shop.scrollTop = productToHighlight.offsetTop - 15
  }

  renderVariantOptions(product){
    const variants = product.variants.reduce((arr, variant) => {
      const variantLabel = SizeLookup[variant.title] || variant.title
      if(variantLabel && variantLabel !== 'Default Title'){
        const className = arr.length === 0 ? "sv__shop-variant-option sv-js -selected" : "sv__shop-variant-option sv-js"
        arr.push(`<a class="${className}" data-action="set variant" data-variant-id="${variant.id}">${variantLabel}</a>`)
      }
      return arr
    }, [])

    return variants.length ? `<div class="sv__shop-variant-options">${variants.join('')}</div>` : ''
  }

  fillPopups(data){    
    //info popup
    if(data.info_text){
      this.elems.buttonLookup.info.classList.remove('hidden')
      this.elems.popupContentLookup.info.innerHTML = data.info_text
    } else {
      this.elems.buttonLookup.info.classList.add('hidden')
      this.elems.popupContentLookup.info.innerHTML = ""
    }
  }

  filterPosts(postId){
    if(this.state.filters){
      if(!this.filter_preview_dataset){
        this.updateFilterPreviewDataset()
      }
    } else {
      this.filter_preview_dataset = this.base_dataset.slice(0)
    }

    this.active_dataset = this.filter_preview_dataset

    if(postId){
      const idx = this.active_dataset.findIndex(t => t.id == postId)
      if(idx > -1){
        this.active_dataset.unshift(this.active_dataset.splice(idx, 1)[0])
      }
    }

    this.feedSize = 0
    this.elems.feed.classList.add('-faded')
    this.elems.feed.innerHTML = ''
    this.elems.feed.style.setProperty('--idx', 0)
    this.idx = 0
    this.addPage(this.active_dataset[0])
    this.addPage(this.active_dataset[1])
    this.setActive()
    window.setTimeout(() => {
      this.elems.feed.classList.remove('-faded')
    }, 200)
  }

  handleSwipeEnd(y){
    const diff = y - this.initialY
    this.elems.feed.classList.remove('-free-scroll')

    if(Math.abs(diff) < 10){
      //click event
    }
    else if(diff > this.swipeThreshold && this.idx !== 0){
      --this.idx
      this.elems.feed.style.setProperty('--idx', this.idx)
    } else if (diff < -this.swipeThreshold && this.idx < this.elems.feed.children.length - 1){
      ++this.idx
      this.elems.feed.style.setProperty('--idx', this.idx)
      if(this.idx === this.elems.feed.children.length - 1){
        this.addPage(this.active_dataset[this.idx + 1])
      }
    }

    this.setActive()

    this.elems.feed.style.removeProperty('top')
  }

  handleSwipeMove(e){
    const y = e.pageY ? e.pageY - this.elems.main.offsetTop : e.changedTouches[0].pageY,
      diff = y - this.initialY

    this.elems.feed.style.top = [this.initialFeedY + diff, 'px'].join('')
  }

  handleSwipeStart(type){    
    this.initialFeedY = this.elems.feed.offsetTop
    this.elems.feed.classList.add('-free-scroll')
  }

  addPage(post){
    if(!post) return;
    //else
    const page = document.createElement('div')

    page.innerHTML =`
      <div class="cz__animal" style="background-image: url(/images/animals/${post.imgsrc})"></div>

      <div class="cz__animal-name">
        <a class="cz__animal-name__name">${post.animal_name}</a>
        <span class="cz__animal-name__rarity">${post.rarity}</span>
      </div>      

      <div class="sv__page-info">
        <div class="cz__animal-health">
          <i class="fas fa-smile fa-2x ${post.health === 2 ? '-selected' : ''}"></i>
          <i class="fas fa-meh fa-2x ${post.health === 1 ? '-selected' : ''}"></i>
          <i class="fas fa-frown fa-2x ${post.health === 0 ? '-selected' : ''}"></i>
        </div>
        
        ${post.description && post.description.length ? `<p class="sv__page-info-description">${post.description}</p>` : ''}
        <span class="cz__animal-birthdate">Born on: <span class="cz__animal-birthdate__date">${post.date_created}</span></span>
      </div>
    `
    //todo fill in other info
    page.classList.add('sv__page')

    ++this.feedSize
    this.elems.feed.style.setProperty('--size', this.feedSize)
    this.elems.feed.appendChild(page)      
  }

  closePopup(){
    this.elems.popupsParent.classList.remove('-open')
    //wait for animation
    window.setTimeout(() => {      
      delete this.elems.popupsParent.dataset.state
    }, 400)
  }

  openPopup(name){
    this.elems.popupsParent.dataset.state = name
    this.elems.popupsParent.classList.add('-open')
  }

  //sets data for current post
  setActive(){
    //only fire on post change
    if(this.active_dataset[this.idx] != this.currentPage){      
      if(this.currentPage){
        
      }
      
      this.currentPage = this.active_dataset[this.idx]

      this.state.id = this.currentPage.id
      this.fillPopups(this.currentPage)

      //add to history
      window.history.pushState('', '', `?state=${btoa(JSON.stringify(this.state))}`)
    }
  }
}

;(async function(){
  const dataresp = await fetch('/data').then(resp => resp.json())
  window.zoo = new ZooFeed(document.getElementById('ShoppableVid'), dataresp.data);
}());
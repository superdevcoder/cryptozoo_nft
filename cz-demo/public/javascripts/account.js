;(async function(){
  const utils = document.querySelector('.account-utils')
  utils.addEventListener('click', e => {
    const tgt = e.target.closest('.ac-js')
    if(tgt){
      switch(tgt.dataset.action){
        case 'logout':
          location.href = '/'
          // if(window.confirm('Log Out?')){
          //   localStorage.removeItem('czUser')
          //   location.href = '/'
          // }
          break;
      }
    }
  })

  const detailsElem = document.getElementById('AccountDetails'),
    eggModal = window.modals["hatch egg"],
    _eggModalVideos = eggModal.elem.querySelectorAll('video'),
    eggModalVideos = {
      basic: _eggModalVideos[0],
      hybrid: _eggModalVideos[1]
    },
    eggModalText = eggModal.elem.querySelector('h2'),
    currentEggRate = 100,
    breedPair = []

  let user = JSON.parse(localStorage.czUser),
    userZoo = {
      eggs: [],
      hatched: []
    }
    
  const creatures = [
    {
      "id": 513,
      "user_id": 3,
      "creature_id": 156,
      "created": "2021-05-07T16:27:23.550Z",
      "is_hybrid": false,
      "is_egg": true,
      "has_bred": false,
      "animal_id": "2b0b27f9-5725-4252-a9ea-6838218bce0e",
      "breed_count": 0,
      "last_bred": null,
      "_animal_id_1": null,
      "_animal_id_2": null,
      "name": "Gorilla",
      "description": null,
      "unique_id": "2b0b27f9-5725-4252-a9ea-6838218bce0e",
      "rarity": 1000,
      "animal_id_1": null,
      "animal_id_2": null
    },
    {
      "id": 524,
      "user_id": 3,
      "creature_id": 155,
      "created": "2021-05-07T16:27:22.963Z",
      "is_hybrid": false,
      "is_egg": true,
      "has_bred": false,
      "animal_id": "186207fd-1606-44e6-8790-be2615fa77b5",
      "breed_count": 0,
      "last_bred": null,
      "_animal_id_1": null,
      "_animal_id_2": null,
      "name": "Kitten",
      "description": null,
      "unique_id": "186207fd-1606-44e6-8790-be2615fa77b5",
      "rarity": 1000,
      "animal_id_1": null,
      "animal_id_2": null
    },
    {
      "id": 434,
      "user_id": 3,
      "creature_id": 137,
      "created": "2021-04-22T00:39:36.827Z",
      "is_hybrid": true,
      "is_egg": false,
      "has_bred": false,
      "animal_id": "48bd2e7a-1965-4c9f-952d-e880fb4e043f",
      "breed_count": 0,
      "last_bred": null,
      "_animal_id_1": 12,
      "_animal_id_2": 2,
      "name": "Kitty Pug",
      "description": null,
      "unique_id": "48bd2e7a-1965-4c9f-952d-e880fb4e043f",
      "rarity": null,
      "animal_id_1": "186207fd-1606-44e6-8790-be2615fa77b5",
      "animal_id_2": "15d265a9-90c4-4513-ae12-e136a05485cf"
    },
    {
      "id": 268,
      "user_id": 3,
      "creature_id": 127,
      "created": "2021-04-14T14:39:52.929Z",
      "is_hybrid": true,
      "is_egg": false,
      "has_bred": false,
      "animal_id": "5b82da3d-02ca-496a-8acc-b27197eb4ce5",
      "breed_count": 0,
      "last_bred": null,
      "_animal_id_1": 1,
      "_animal_id_2": 12,
      "name": "Gorkitten",
      "description": null,
      "unique_id": "5b82da3d-02ca-496a-8acc-b27197eb4ce5",
      "rarity": null,
      "animal_id_1": "2b0b27f9-5725-4252-a9ea-6838218bce0e",
      "animal_id_2": "186207fd-1606-44e6-8790-be2615fa77b5"
    }
  ]
  async function updateCreatures(){
    // const { creatures } = await window.EndpointManager.get(`/data/creatures/${user.id}`)  //need to be synced from contract
    const creatures = [
      {
        "id": 513,
        "user_id": 3,
        "creature_id": 156,
        "created": "2021-05-07T16:27:23.550Z",
        "is_hybrid": true,
        "is_egg": false,
        "has_bred": false,
        "animal_id": "2b0b27f9-5725-4252-a9ea-6838218bce0e",
        "breed_count": 0,
        "last_bred": null,
        "_animal_id_1": null,
        "_animal_id_2": null,
        "name": "Gorilla",
        "description": null,
        "unique_id": "2b0b27f9-5725-4252-a9ea-6838218bce0e",
        "rarity": 1000,
        "animal_id_1": null,
        "animal_id_2": null
      },
      {
        "id": 524,
        "user_id": 3,
        "creature_id": 155,
        "created": "2021-05-07T16:27:22.963Z",
        "is_hybrid": false,
        "is_egg": true,
        "has_bred": false,
        "animal_id": "186207fd-1606-44e6-8790-be2615fa77b5",
        "breed_count": 0,
        "last_bred": null,
        "_animal_id_1": null,
        "_animal_id_2": null,
        "name": "Kitten",
        "description": null,
        "unique_id": "186207fd-1606-44e6-8790-be2615fa77b5",
        "rarity": 1000,
        "animal_id_1": null,
        "animal_id_2": null
      },
      {
        "id": 434,
        "user_id": 3,
        "creature_id": 137,
        "created": "2021-04-22T00:39:36.827Z",
        "is_hybrid": true,
        "is_egg": false,
        "has_bred": false,
        "animal_id": "48bd2e7a-1965-4c9f-952d-e880fb4e043f",
        "breed_count": 0,
        "last_bred": null,
        "_animal_id_1": 12,
        "_animal_id_2": 2,
        "name": "Kitty Pug",
        "description": null,
        "unique_id": "48bd2e7a-1965-4c9f-952d-e880fb4e043f",
        "rarity": null,
        "animal_id_1": "186207fd-1606-44e6-8790-be2615fa77b5",
        "animal_id_2": "15d265a9-90c4-4513-ae12-e136a05485cf"
      },
      {
        "id": 268,
        "user_id": 3,
        "creature_id": 127,
        "created": "2021-04-14T14:39:52.929Z",
        "is_hybrid": true,
        "is_egg": false,
        "has_bred": false,
        "animal_id": "5b82da3d-02ca-496a-8acc-b27197eb4ce5",
        "breed_count": 0,
        "last_bred": null,
        "_animal_id_1": 1,
        "_animal_id_2": 12,
        "name": "Gorkitten",
        "description": null,
        "unique_id": "5b82da3d-02ca-496a-8acc-b27197eb4ce5",
        "rarity": null,
        "animal_id_1": "2b0b27f9-5725-4252-a9ea-6838218bce0e",
        "animal_id_2": "186207fd-1606-44e6-8790-be2615fa77b5"
      }
    ]
    userZoo = {
      eggs: [],
      hatched: [],
      hybrids: []
    }
    creatures.forEach(creature => {
      if(creature.is_egg){
        userZoo.eggs.push(creature)
      } else if(creature.has_bred){
        userZoo.hybrids.push(creature)
      } else {
        userZoo.hatched.push(creature)
      }
    })
    window.userZoo = userZoo
  }

//<button class="account-button ac-js" data-action="hatch all" ${userZoo.eggs.length === 0 ? 'disabled' : ''}>Hatch All</button>
  async function renderAccountDetails(){
    let animalsHTML = ''

    if(userZoo.hatched.length) {
      const animalsHTMLarr = [],
        breedable = [],
        nonbreedable = []

      userZoo.hatched.forEach(animal => {
        if(animal.has_bred || animal.is_hybrid) nonbreedable.push(animal)
        else breedable.push(animal)
      })

      breedable.sort((a,b) => a.name.localeCompare(b.name))
      nonbreedable.sort((a,b) => a.is_hybrid ? b.is_hybrid ? 0 : 1 : -1)

      await Promise.all([...breedable, ...nonbreedable].map(creature => {
        return new Promise(async resolve => {
          const imgdata = await fetch(`/data/image/${creature.name}`).then(resp => resp.json())
          creature.imgstr = imgdata.imgstr
          resolve()
        })
      }))

      if(breedable.length){
        animalsHTMLarr.push(`<div class="account-row">
        <h3>Breedable Animals</h3>
        <div class="account-creature-list">
          ${breedable.map(creature => {
            return `<div class="creature-card ac-js" data-action="breed" data-id="${creature.creature_id}" data-animal-id="${creature.animal_id}">
              <img src="${creature.imgstr}" alt="${creature.name}" />
              <div class="creature-card-details">
                <h4>${creature.name}</h4>
                <div class="creature-card-cta">Breed</div>
              </div>
            </div>`
          }).join('')}
        </div>
      </div>`)
      }

      if(nonbreedable.length){
        animalsHTMLarr.push(`<div class="account-row">
        <h3>Hybrids</h3>
        <div class="account-creature-list">
          ${nonbreedable.map(creature => {
            return `<div class="creature-card" data-id="${creature.creature_id}" data-animal-id="${creature.animal_id}">
              <img src="${creature.imgstr}" alt="${creature.name}" />
              <div class="creature-card-details">
                <h4>${creature.name}</h4>
              </div>
            </div>`
          }).join('')}
        </div>
      </div>`)
      }
      
      
      animalsHTML = animalsHTMLarr.join('')
    }

    detailsElem.innerHTML = `
      <div class="account-row">
        <h3>Wallet Balance - ${user.wallet_balance}</h3>
        <button class="account-button ac-js" data-action="add funds">Add Funds</button>
      </div>
      <div class="account-row">
        <h3>${userZoo.eggs.length} Eggs owned</h3>
        <button class="account-button ac-js" data-action="buy eggs">Buy Eggs</button>
        <div class="account-creature-list egg-list">
          ${userZoo.eggs.map(egg => `
            <div class="creature-card ac-js" data-action="hatch egg" data-id="${egg.creature_id}">
              <img src="/images/egg_small${egg.is_hybrid ? '_hybrid' : ''}.jpg" alt="" />
              <div class="creature-card-details">
                <div class="creature-card-type">${egg.is_hybrid ? 'Hybrid' : 'Basic'}</div>
                <div class="creature-card-cta">Hatch</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      ${animalsHTML}
    `
  }


  detailsElem.addEventListener('click', async e => {
    const tgt = e.target.closest('.ac-js')
    if(tgt){
      switch(tgt.dataset.action){
        case 'add funds':
          const amountObj = await window.quickFormPromise('Amount?', { amount: { type: 'number' } }),
            amount = amountObj ? parseInt(amountObj.amount) : null
          if(amount){
            const data = await window.EndpointManager.post('/users/update', {
              id: user.id,
              vals: {
                "wallet_balance": user.wallet_balance + amount
              }
            })

            user = data.user
            localStorage.czUser = JSON.stringify(user)
          }
          renderAccountDetails()
          break;

        case 'buy eggs':
          const eggObj = await window.quickFormPromise(`How many eggs?<br><span style="font-size: 0.6em">(current price: ${currentEggRate}/egg)</span>`, { amount: { type: 'number', default: 1, label: '' } })
          let numberOfEggs = eggObj ? parseInt(eggObj.amount) : null
          if(numberOfEggs) {
            const fee = numberOfEggs * currentEggRate,
              remainingBalance = user.wallet_balance - fee
            if(remainingBalance < 0){
              alert(`Insufficient funds, please add at least ${-remainingBalance} to make this purchase.`)
            } else {
              while(--numberOfEggs > -1){
                await window.EndpointManager.post('/data/generate-egg', {
                  user_id: user.id
                })
              }
              
              const data = await window.EndpointManager.post('/users/update', {
                id: user.id,
                vals: {
                  "wallet_balance": remainingBalance
                }
              })
  
              user = data.user
              localStorage.czUser = JSON.stringify(user)

              updateCreatures().then(renderAccountDetails)
            }
          }
          break;

        case 'hatch egg':
          const confirmHatch = await window.quickConfirm(`You want to hatch this egg?`)
          if(confirmHatch){
            const egg_id = parseInt(tgt.dataset.id),
              egg = userZoo.eggs.filter(_egg => _egg.creature_id === egg_id)[0]
            let eggModalVideo;
            if(egg.is_hybrid){
              eggModalVideo = eggModalVideos.hybrid
              eggModalVideos.basic.classList.add('hidden')
            } else {            
              eggModalVideo = eggModalVideos.basic
              eggModalVideos.hybrid.classList.add('hidden')
            }

            const imgdata = await fetch(`/data/image/${egg.name}`).then(resp => resp.json())

            eggModalText.textContent = egg.rarity ? `${egg.name} - 1/${egg.rarity}` : egg.name
            eggModal.elem.style.backgroundImage = `url(${imgdata.imgstr})`
            eggModalVideo.classList.remove('hidden')
            eggModalVideo.classList.remove('-fade-out')
            eggModal.open()
            eggModalVideo.play()
            window.setTimeout(() => {
              eggModalVideo.classList.add('-fade-out')
            }, 5000)

            await window.EndpointManager.post('/data/hatch-egg', { id: egg_id })
            
            updateCreatures().then(renderAccountDetails)
          }
          break;

        case 'breed':
          if(!breedPair.length) {
            //this is the first click
            tgt.classList.add('-active')
            breedPair.push(tgt)
          } else if(tgt === breedPair[0]) {
            //deselect
            tgt.classList.remove('-active')
            breedPair.splice(0, 1)
          } else {
            //trigger breed
            tgt.classList.add('-active')
            breedPair.push(tgt)

            const animal_id_1 = breedPair[0].dataset.animalId,
              animal_id_2 = breedPair[1].dataset.animalId,
              creature_id_1 = breedPair[0].dataset.id,
              creature_id_2 = breedPair[1].dataset.id

            await Promise.all([
              window.EndpointManager.post('/data/generate-egg', { 
                user_id: user.id,
                animal_id_1,
                animal_id_2
              }),
              window.EndpointManager.get(`/data/breed/${creature_id_1}`),
              window.EndpointManager.get(`/data/breed/${creature_id_2}`)
            ])

            breedPair.splice(0, 2)

            updateCreatures().then(renderAccountDetails)
          }
          break;
      }
    }
  })

  updateCreatures().then(renderAccountDetails)

}());
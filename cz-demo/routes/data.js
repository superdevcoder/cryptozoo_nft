const express = require('express'),
  router = express.Router(),
  { Client } = require('pg'),
  connectionData = {
    connectionString: process.env.DATABASE_URL || "postgres://napsuiqmfzzioa:8f5fd7ab801a5cc158809767a38c873e394a3feacfd3af05d1f42e827b9bb561@ec2-54-224-120-186.compute-1.amazonaws.com:5432/dcqil73almnnuv",
    ssl: { rejectUnauthorized: false }
  },  
  demodata = require('../data'),
  cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: "htcif1pyx",
  api_key: "198615939156871",
  api_secret: "EyhTcLFCEI0if7iipgXKT7iLKg8",
  environment_variable: "cloudinary://198615939156871:EyhTcLFCEI0if7iipgXKT7iLKg8@htcif1pyx"
})

function sanitize(str){
  return str.replace(/'/g, "''")
}

router.get('/', async (req, res) => {
  res.status(200).json({ data: demodata })
})

router.get('/image/:creaturename', async (req, res) => {
  const imgresult = await cloudinary.search.expression(req.params.creaturename).max_results(1).execute(),
    imgobj = imgresult.resources[0]

  let imgstr = ''

  if(imgobj){
    const assetURL = [imgobj.public_id, imgobj.format].join('.')
    imgstr = cloudinary.url(assetURL, { width: 600 })
  }

  res.status(200).json({ imgstr })
})

router.get('/breed/:creature_id', async (req, res) => {
  await dbRequest(`UPDATE creatures SET has_bred = true WHERE id = ${req.params.creature_id}`)
  res.status(200).json({ msg: 'done' })
})

router.get('/creatures/:user_id', async (req, res) => {
  const creatures = await dbRequest(`SELECT * FROM creatures_to_users JOIN creatures ON creatures_to_users.creature_id = creatures.id JOIN animals ON creatures.animal_id = animals.unique_id WHERE creatures_to_users.user_id = ${req.params.user_id} ORDER BY creatures.created DESC`)
  res.status(200).json({ creatures })
})

router.get('/eggs/:user_id', async (req, res) => {
  const creatures = await dbRequest(`SELECT * FROM creatures_to_users JOIN creatures ON creatures_to_users.creature_id = creatures.id JOIN animals ON creatures.animal_id = animals.unique_id WHERE creatures.is_egg = true AND creatures_to_users.user_id ${req.params.user_id} ORDER BY creatures.created DESC`)
  res.status(200).json({ creatures })
})

router.get('/breedable/:user_id', async (req, res) => {
  const creatures = await dbRequest(`SELECT * FROM creatures_to_users JOIN creatures ON creatures_to_users.creature_id = creatures.id JOIN animals ON creatures.animal_id = animals.unique_id WHERE creatures.is_egg = false AND creatures.has_bred = false AND creatures.is_hybrid = false AND creatures_to_users.user_id ${req.params.user_id} ORDER BY creatures.created DESC`)
  res.status(200).json({ creatures })
})

router.post('/generate-egg', async(req, res) => {
  const user_id = req.body.user_id
  let animal, is_hybrid
  if(req.body.animal_id_1){
    //generate hybrid egg
    console.log('generating hybrid')
    const animalResponse = await dbRequest(`SELECT * FROM animals WHERE animal_id_1 = '${req.body.animal_id_1}' AND animal_id_2 = '${req.body.animal_id_2}'`)
    animal = animalResponse[0]
    is_hybrid = 'true'
  } else {
    //generate base egg
    const data = await dbRequest('SELECT * FROM animals WHERE is_hybrid = false'),
      randLookupArr = []

    data.forEach(animal => {
      let i = animal.rarity
      while(--i > -1){
        randLookupArr.push(animal)
      }
    })

    const idx = Math.floor(Math.random() * randLookupArr.length)

    animal = randLookupArr[idx]
    is_hybrid = 'false'
  }

  const creatureData = await dbRequest(`INSERT INTO creatures(animal_id, is_hybrid) VALUES ('${animal.unique_id}', ${is_hybrid}) RETURNING id`),
    creature_id = creatureData[0].id
  
  await dbRequest(`INSERT INTO creatures_to_users(user_id, creature_id) VALUES (${user_id}, ${creature_id})`)
  await dbRequest(`INSERT INTO creature_history(creature_id, action) VALUES (${creature_id}, 'EGG CREATED')`)

  res.status(200).json({ msg: 'complete' })
})

router.post('/hatch-egg', async(req, res) => {
  console.log('this is egg', req.body.id, 'end egg')
  await dbRequest(`UPDATE creatures SET is_egg = false WHERE id = ${req.body.id}`)
    
  await dbRequest(`INSERT INTO creature_history(creature_id, action) VALUES (${req.body.id}, 'EGG HATCHED')`)

  res.status(200).json({ msg: 'hatched' })
})

router.get('/:table', async (req, res) => {
  const table = req.params.table.replace(/ .+/, ''),
    queryStr = `SELECT * FROM ${table}`
  
  dbRequest(queryStr).then(data => {
    res.status(200).json(data)
  }).catch(data => {
    res.status(500).json(data)
  })
})

router.post('/add/:table', (req, res) => {
  const table = req.params.table.replace(/ .+/, ''),
    keys = Object.keys(req.body),
    values = keys.map(key => {
      if(key === 'null') return key
      return `'${sanitize(req.body[key])}'`
    }),
    queryStr = `INSERT INTO ${table} (${keys.join()}) VALUES (${values.join()}) RETURNING id`
  console.log('body', req.body)
  console.log('querystr', queryStr)
  
  dbRequest(queryStr).then(data => {
    res.status(200).json(data)
  }).catch(data => {
    res.status(500).json(data)
  })
})

module.exports = router;
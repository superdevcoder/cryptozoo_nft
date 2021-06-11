const express = require('express'),
  router = express.Router(),
  { Client } = require('pg'),
  connectionData = {
    connectionString: process.env.DATABASE_URL || "postgres://napsuiqmfzzioa:8f5fd7ab801a5cc158809767a38c873e394a3feacfd3af05d1f42e827b9bb561@ec2-54-224-120-186.compute-1.amazonaws.com:5432/dcqil73almnnuv",
    ssl: { rejectUnauthorized: false }
  }

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res) => {
  const paramname = req.body.name.indexOf('@') > -1 ? 'email' : 'name',
    userResults = await dbRequest(`SELECT * FROM users WHERE ${paramname} = '${req.body.name}' and password = '${req.body.password}'`),
    user = userResults[0]

  if(user){
    delete user.password
    
    res.status(200).json({ user })
  } else {
    res.status(200).json({
      error: 'User not found'
    })
  }
})

router.get('/:user_id', async (req, res) => {
  const userResults = await dbRequest(`SELECT * FROM users WHERE id = ${req.params.user_id}`),
    user = userResults[0]

  delete user.password

  res.status(200).json({ user })
})

router.post('/update', async (req, res) => {
  const setstr = Object.keys(req.body.vals).reduce((arr, key) => {
    let val = req.body.vals[key]
    if(typeof val === 'string') {
      val = `'${sanitize(val)}'`
    }
    arr.push(`${key} = ${val}`)
    return arr
  }, []).join(', ')
    userData = await dbRequest(`UPDATE users SET ${setstr} WHERE id = ${req.body.id} RETURNING *`),
    user = userData[0]

  delete user.password

  res.status(200).json({ user })
})

router.post('/register', async (req, res) => {
  const existingName = await dbRequest(`SELECT id FROM users WHERE name = '${req.body.name}'`)
  if(existingName.length){
    res.status(200).json({ error: 'Name already exists', field: 'name' })
    return;
  }
  //else
  const existingEmail = await dbRequest(`SELECT id FROM users WHERE email = '${req.body.email}'`)
  if(existingEmail.length){
    res.status(200).json({ error: 'Email already exists', field: 'email' })
    return;
  }
  //else register
  const userData = await dbRequest(`INSERT INTO users (name, email, password) VALUES ('${req.body.name}', '${req.body.email}', '${req.body.password}') RETURNING *`),
    user = userData[0]

  delete user.password

  res.status(200).json({ user })
})

module.exports = router;
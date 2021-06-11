const express = require('express'),
  router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CryptoZoo' })
})

router.get('/feed', (req, res) => {
  res.render('feed', { title: 'CryptoZoo', bodyclass: 'feed' })
})

router.get('/account', (req, res) => {
  res.render('account', { title: 'CryptoZoo - Manage Account' })
})
module.exports = router;
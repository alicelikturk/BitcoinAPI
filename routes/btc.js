const express = require('express');
const router = express.Router();
const btcController = require('../controllers/btcController');

router.get('/isAddress/:wallet/:address', btcController.IsAddress);

router.post('/send/:wallet', btcController.SendTo);


module.exports = router;
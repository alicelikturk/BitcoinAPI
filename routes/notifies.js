const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get("/blocknotify/:blockhash", (req, res, next) => {
    console.log(`blocknotify: ${req.params.blockhash}`);
});
router.get("/walletnotify/:walletname/:txhash", walletController.WalletNotify);

router.get("/alertnotify/:alert", (req, res, next) => {
    console.log(`alertnotify: ${req.params.alert}`);
});

router.post('/', (req, res, next) => {
    res.status(200).json({
        message: 'notify accepted'
    });
});

module.exports = router;
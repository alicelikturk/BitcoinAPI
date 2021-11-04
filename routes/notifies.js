const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Test
router.get("/blocknotify/:blockhash", (req, res, next) => {
    console.log('blockhash');
    console.log(req.params.blockhash);
    // res.status(200).json({
    //     message: 'notify accepted'
    // });
});
router.get("/walletnotify/:walletname/:txhash", walletController.WalletNotify);

router.get("/alertnotify/:alert", (req, res, next) => {
    console.log('alert');
    console.log(req.params.alert);
    // res.status(200).json({
    //     message: 'notify accepted'
    // });
});

router.post('/', (req, res, next) => {
    // console.log('notify arrived');
    // console.log('data');
    // console.log(req.body);
    res.status(200).json({
        message: 'notify accepted'
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();


// Test
router.get("/blocknotify", (req, res, next) => {
    console.log('blocknotify arrived');
    console.log('data');
    console.log(req.body);
    // res.status(200).json({
    //     message: 'notify accepted'
    // });
});
router.get("/walletnotify", (req, res, next) => {
    console.log('walletnotify arrived');
    console.log('data');
    console.log(req.body);
    // res.status(200).json({
    //     message: 'notify accepted'
    // });
});
router.get("/alertnotify", (req, res, next) => {
    console.log('alertnotify arrived');
    console.log('data');
    console.log(req.body);
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
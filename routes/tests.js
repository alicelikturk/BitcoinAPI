const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
    // console.log('notify arrived');
    // console.log('data');
    // console.log(req.body);
    res.status(200).json({
        node: 'Test Node',
        request: req.body
    });
});

module.exports = router;
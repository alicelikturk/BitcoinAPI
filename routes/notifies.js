const express = require('express');
const router = express.Router();


// Test
router.get("/blocknotify/:blockhash", (req, res, next) => {
    console.log('blockhash');
    console.log(req.params.blockhash);
    // res.status(200).json({
    //     message: 'notify accepted'
    // });
});
router.get("/walletnotify/:txhash", (req, res, next) => {
    console.log('txhash');
    console.log(req.params.txhash);

    var dataString = `{"jsonrpc":"1.0","id":"1","method":"gettransaction","params":["${req.params.txhash}"]}`;
    requestController.RpcRequest({ chain: "test" }, dataString).then((rpc_res) => {
            var postData = {
                txHash: rpc_res.result.blockheight.txid,
                to: txConfirmation.tx.to,
                value: valueEther,
                from: txConfirmation.tx.from,
                confirmation: txConfirmation.confirmation,
                asset: asset
            }
            const transaction = {
                asset: 'btc',
                confirmations: rpc_res.result.confirmations,
                txBlock: rpc_res.result.blockheight,
                currentBlock: rpc_res.result.blockheight + rpc_res.result.confirmations,
                txId: rpc_res.result.blockheight.txid,
                from: '',
                to: '',
                amount: rpc_res.result.amount,
                details: rpc_res.result.details
            };
            res.status(200).json({
                tx: transaction
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });


    request({
        uri: url,
        method: "POST",
        body: JSON.stringify(postData),
        rejectUnauthorized: false,
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'aB8ccABtup85AoKtl96aY904IU889paso'
        }
    }, function(error, response, body) {
        console.log(colors.cyan('Deposit ether confirmation notification request \t' +
            '{' + url + ', ' + valueEther + ' eth, ' + txConfirmation.tx.hash + '}' + ' sent'));
        if (error) {
            console.log(colors.magenta('Deposit ether confirmation notification error \t' +
                JSON.stringify(error)));
        } else {
            console.log(colors.white('Deposit ether confirmation notification response \t' +
                JSON.stringify(response.body)));
        }
    });


    // res.status(200).json({
    //     message: 'notify accepted'
    // });
});
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
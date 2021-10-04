const mongoose = require("mongoose");
const Block = require("../models/block");
const colors = require('colors');
const requestController = require('../controllers/requestController');

var web3;
var subscription;
// const web3Model = require('../models/web3Model');
// web3Model.SetClient(true)
//     .then((url) => {
//         web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(url));
//         subscription = web3.eth.subscribe('newBlockHeaders');
//     });

exports.SubscribeNewBlockHeaders = (req, res, next) => {
    // subscription.subscribe((error, result) => {
    //     if (!error) {
    //         const blockMessage = 'Block: ' + result.number + ' ' + result.hash;
    //         console.log(blockMessage.bgGreen);
    //         const block = new Block({
    //             _id: new mongoose.Types.ObjectId(),
    //             number: result.number,
    //             hash: result.hash,
    //             timestamp: result.timestamp
    //         });
    //         block.save()
    //             .then(_result => {
    //                 //console.log(result.hash);
    //                 //console.log('Block saved');
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //             });
    //         return;
    //     }
    // });
    res.status(200).json({
        message: 'Blocks successfully subscribed'
    });
};

exports.UnsubscribeNewBlockHeaders = (req, res, next) => {
    // subscription.unsubscribe(function(error, success) {
    //     if (success) {
    //         console.log('Blocks successfully unsubscribed!');
    //     }
    // });
    res.status(200).json({
        message: 'Blocks successfully unsubscribed'
    });
};

exports.GetLatestBlock = (req, res, next) => {
    var dataString = `{"jsonrpc":"1.0","id":"1","method":"getbestblockhash","params":[]}`;
    requestController.RpcRequest("test",dataString).then((blockHash) => {
        console.log(blockHash);
        var dataString2 = `{"jsonrpc":"1.0","id":"1","method":"getblock","params":["${blockHash.result}"]}`;

        requestController.RpcRequest("test",dataString2).then((block) => {
            console.log(block);
            res.status(200).json(block);
        }) .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    });
};

exports.GetBlockHash = (req, res, next) => {
    var dataString = `{"jsonrpc":"1.0","id":"1","method":"getblockhash","params":[${req.params.index
        }]}`;

    requestController.RpcRequest("test",dataString).then((result) => {
        console.log("data: " + dataString);
        console.log(result);
        res.status(200).json(result);
    }) .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
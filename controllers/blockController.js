const mongoose = require("mongoose");
const Block = require("../models/block");
const colors = require('colors');
const requestController = require('../controllers/requestController');

exports.SubscribeNewBlockHeaders = (req, res, next) => {
    res.status(404).json({
        message: 'Bitcoin blockchain notification subscription starts automatically'
    });
};

exports.UnsubscribeNewBlockHeaders = (req, res, next) => {
    res.status(404).json({
        message: 'Bitcoin blockchain notification subscription starts automatically'
    });
};

exports.GetLatestBlock = (req, res, next) => {
    var dataString = `{"jsonrpc":"1.0","id":"1","method":"getbestblockhash","params":[]}`;
    requestController.RpcRequest({ chain: "test" }, dataString).then((blockHash) => {
        console.log(blockHash);
        var dataString2 = `{"jsonrpc":"1.0","id":"1","method":"getblock","params":["${blockHash.result}"]}`;

        requestController.RpcRequest("test", dataString2).then((block) => {
            console.log(block);
            res.status(200).json(block);
        }).catch(err => {
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

    requestController.RpcRequest({ chain: "test" }, dataString).then((result) => {
        console.log("data: " + dataString);
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};
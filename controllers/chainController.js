const mongoose = require("mongoose");
const Account = require("../models/account");
const Wallet = require("../models/wallet");
const Client = require("../models/client");
const requestController = require('../controllers/requestController');
const colors = require('colors');
const fs = require('fs')

exports.IsAddress = (req, res, next) => {
    const address = req.params.address;
    var dataString = `{"jsonrpc":"1.0","id":"1","method":"validateaddress","params":["${address}"]}`;
    requestController.RpcRequest({ chain: "test" }, dataString).then((rpc_res) => {
            res.status(200).json({
                result: rpc_res.result.isvalid,
                address: rpc_res.result.address
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.GetChain = (req, res, next) => {
    var dataString = `{"jsonrpc":"1.0","id":"1","method":"getblockchaininfo","params":[]}`;
    requestController.RpcRequest({ chain: "test" }, dataString).then((rpc_res) => {
            res.status(200).json({
                result: rpc_res.result.chain,
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.GetProvider = (req, res, next) => {
    var dataString = `{"jsonrpc":"1.0","id":"1","method":"getblockchaininfo","params":[]}`;
    requestController.RpcRequest({ chain: "test" }, dataString).then((rpc_res) => {
        if (rpc_res.result.chain) {
            Client.find({ isActive: true })
                .exec()
                .then(docs => {
                    var _provider = "";
                    if (docs.length > 0) {
                        if (rpc_res.result.chain === "main") {
                            _provider = docs[0].mainnet;
                        } else {
                            _provider = docs[0].testnet;
                        }
                        res.status(200).json({
                            url: _provider,
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            console.log(rpc_res);
        }
    });

};

exports.GetTransaction = (req, res, next) => {
    const txHash = req.params.txHash;
    console.log("txHash: " + txHash);
    var dataString = `{"jsonrpc":"1.0","id":"1","method":"gettransaction","params":["${txHash}"]}`;
    requestController.RpcRequest({ chain: "test" }, dataString).then((rpc_res) => {
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
};

exports.GetBalance = (req, res, next) => {
    res.status(404).json({
        error: "The method does not exist for BTC address. Only for wallet"
    });
};

exports.SendTo = (req, res, next) => {
    const name = req.body.wallet;
    const amount = req.body.amount;
    const toAddress = req.body.address;
    Wallet.findOne({ name: name })
        .then(wallet => {
            if (!wallet) {
                return res.status(404).json({
                    txHash: null,
                    message: "Wallet not found"
                });
            }
            var dataStringBalance = `{"jsonrpc":"1.0","id":"1","method":"getbalance","params":["*", 1]}`;
            requestController.RpcRequest({ chain: "test", wallet: wallet.name }, dataStringBalance).then((rpc_res_balance) => {
                    var dataStringSendToAddress = `{"jsonrpc":"1.0","id":"1","method":"sendtoaddress","params":["${toAddress}", ${amount}]}`;
                    requestController.RpcRequest({ chain: "test", wallet: wallet.name }, dataStringSendToAddress).then((rpc_res_send) => {
                            console.log('SEND');
                            console.log(rpc_res_send.result);
                            //
                            const txHash = rpc_res_send.result;

                            var dataStringResultTxHash = `{"jsonrpc":"1.0","id":"1","method":"gettransaction","params":["${txHash}"]}`;
                            requestController.RpcRequest({ chain: "test", wallet: wallet.name }, dataStringResultTxHash).then((rpc_resResultTxHash) => {
                                    console.log(colors.bgGreen.white('Send Transaction'));
                                    console.log(colors.cyan(rpc_res));
                                    console.log(colors.cyan(rpc_res.result.details));

                                    var details = rpc_res.result.details.filter(element => element.address === toAddress);

                                    res.status(200).json({
                                        txHash: rpc_res_send.result,
                                        fee: details.fee
                                    });

                                })
                                .catch(err => {
                                    console.log('Wallet notify "gettransaction"');
                                    console.log(err);
                                });

                        })
                        .catch(err => {
                            console.log('SendTo errSend: ');
                            res.status(500).json({
                                txHash: null,
                                error: "SendTo errSend error: " + err.error.message
                            });
                        });
                })
                .catch(err => {
                    console.log('SendTo errBalance: ' + err);
                    res.status(500).json({
                        txHash: null,
                        error: "SendTo getBalance error: " + err.error.message
                    });
                });

        });
};

// Test Function
exports.MoveTo = (req, res, next) => {

    res.status(200).json({
        result: "txCount"
    });

};
const mongoose = require("mongoose");
const Wallet = require("../models/wallet");
const Account = require("../models/account");
const requestController = require('../controllers/requestController');
const colors = require('colors');
const request = require("request");

exports.List = (req, res, next) => {
    Wallet.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                wallets: docs.map(doc => {
                    return {
                        wallet: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:7078/wallets/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.Create = (req, res, next) => {
    Wallet.find({ name: req.body.name })
        .exec()
        .then(wallet => {
            if (wallet.length >= 1) {
                return res.status(409).json({
                    message: 'Wallet name exist'
                });
            } else {
                var dataString = `{"jsonrpc":"1.0","id":"1","method":"createwallet","params":["${req.body.name}"]}`;
                requestController.RpcRequest({ chain: "test" }, dataString).then((rpc_res) => {
                    console.log(rpc_res);
                    const wallet = new Wallet({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        notifyUrl: req.body.notifyUrl,
                        network: req.body.network
                    });
                    wallet
                        .save()
                        .then(result => {
                            console.log(result);
                            res.status(200).json({
                                message: 'Wallet created',
                                wallet: {
                                    name: wallet.name,
                                    notifyUrl: wallet.notifyUrl,
                                    network: wallet.network
                                }
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                })
                    .catch(err => {
                        console.log(err.body || err);
                        res.status(500).json(err.body || err);
                    });
            }
        });
};

exports.Get = (req, res, next) => {
    Wallet.findById(req.params.walletId)
        .exec()
        .then(wallet => {
            if (!wallet) {
                return res.status(404).json({
                    message: 'Wallet not found'
                });
            }
            res.status(200).json({
                wallet: wallet,
                request: {
                    type: 'GET',
                    url: 'http://localhost:7078/wallets'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.GetByAddress = (req, res, next) => {
    res.status(404).json({
        error: "The method does not exist for BTC wallet"
    });
};

exports.GetByName = (req, res, next) => {
    Wallet.findOne({ name: req.params.name })
        .exec()
        .then(wallet => {
            if (!wallet) {
                return res.status(404).json({
                    message: 'Wallet not found'
                });
            }
            var dataString = `{"jsonrpc":"1.0","id":"1","method":"listwallets","params":[]}`;
            requestController.RpcRequest({ chain: "test" }, dataString).then((rpc_res) => {
                res.status(200).json({
                    wallet: wallet,
                    isloaded: rpc_res.result.includes(wallet.name),
                    request: {
                        type: 'GET',
                        url: 'http://localhost:7078/wallets'
                    }
                });
            })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.GetBalance = (req, res, next) => {
    Wallet.findById(req.params.walletId)
        .exec()
        .then(wallet => {
            if (!wallet) {
                return res.status(404).json({
                    message: 'Wallet not found'
                });
            }
            var dataString = `{"jsonrpc":"1.0","id":"1","method":"getbalance","params":["*", 1]}`;
            requestController.RpcRequest({ chain: "test", wallet: wallet.name }, dataString).then((rpc_res) => {
                res.status(200).json({
                    _Id: wallet._id,
                    name: wallet.name,
                    notifyUrl: wallet.notifyUrl,
                    network: wallet.network,
                    address: wallet.address,
                    asset: rpc_res.result
                });
            })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.Delete = (req, res, next) => {
    Wallet.deleteOne({ _id: req.params.walletId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Wallet deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.Update = (req, res, next) => {
    const id = req.params.walletId;
    const updateOps = {};
    // only notifyUrl can be changed
    updateOps["notifyUrl"] = req.body["notifyUrl"];
    Wallet.updateOne({ _id: id }, {
        $set: updateOps
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Wallet updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:7078/wallets/'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

};

exports.UpdateByName = (req, res, next) => {
    const name = req.params.wallet;
    const updateOps = {};
    // only notifyUrl can be changed
    updateOps["notifyUrl"] = req.body["notifyUrl"];
    Wallet.updateOne({ name: name }, {
        $set: updateOps
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Wallet updated by name',
                request: {
                    type: 'GET',
                    url: 'http://localhost:7078/wallets/'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

};

exports.WalletAccountList = (req, res, next) => {
    Account.find({ wallet: req.params.walletId })
        .select('wallet address privateKey _id')
        .populate('wallet', 'name network notifyUrl')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                wallet: docs[0].wallet,
                accounts: docs.map(doc => {
                    return {
                        _id: doc._id,
                        address: doc.address,
                        privateKey: doc.privateKey,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:7078/accounts/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};



exports.WalletNotify = (req, res, next) => {
    console.log(req.params);
    // console.log('txhash');
    // console.log(req.params.txhash);
    // console.log('walletname');
    // console.log(req.params.walletname);

    Wallet.findOne({ name: req.params.walletname })
        .exec()
        .then(wallet => {
            if (!wallet) {
                return res.status(404).json({
                    message: 'Wallet not found'
                });
            }
            const txHash = req.params.txhash;

            var dataString = `{"jsonrpc":"1.0","id":"1","method":"gettransaction","params":["${txHash}"]}`;
            requestController.RpcRequest({ chain: "test", wallet: wallet.name }, dataString).then((rpc_res) => {
                console.log(colors.gray(rpc_res.result.details.length+' request sending...'));

                rpc_res.result.details.forEach(element => {

                    var postData = {
                        txHash: rpc_res.result.txid,
                        to: element.address,
                        value: element.amount,
                        from: undefined,
                        confirmation: rpc_res.result.confirmations,
                        asset: "btc"
                    }
                    request({
                        uri: wallet.notifyUrl,
                        method: "POST",
                        body: JSON.stringify(postData),
                        rejectUnauthorized: false,
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': 'aB8ccABtup85AoKtl96aY904IU889paso'
                        }
                    }, function (error, response, body) {
                        console.log(colors.cyan('Deposit btc notification request \t' +
                            '{' + wallet.notifyUrl + '}' + ' sent'));
                        if (error) {
                            console.log(colors.magenta('Deposit btc notification (url: '+wallet.notifyUrl+') error \t' +
                                JSON.stringify(error)));
                        } else {
                            console.log(colors.white('Deposit btc notification response \t' +
                                JSON.stringify(response.body)));
                        }
                    });

                });
            })
                .catch(err => {
                    console.log('Wallet notify "gettransaction"');                    
                    console.log(err);
                });

        })
        .catch(err => {
            console.log('Wallet notify "Wallet.findOne"');                    
                    console.log(err);
        });


};
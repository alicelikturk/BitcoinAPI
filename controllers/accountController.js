const mongoose = require("mongoose");
const Account = require("../models/account");
const Wallet = require("../models/wallet");
const colors = require('colors');
const requestController = require('../controllers/requestController');

exports.List = (req, res, next) => {
    Account.find()
        .select('wallet address privateKey _id')
        .populate('wallet', 'name notifyUrl network')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                accounts: docs.map(doc => {
                    return {
                        _id: doc._id,
                        address: doc.address,
                        privateKey: doc.privateKey,
                        wallet: doc.wallet,
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

exports.Add = (req, res, next) => {
    const name = req.body.wallet;
    console.log(name)
    Wallet.findOne({ name: name })
        .then(wallet => {
            if (!wallet) {
                return res.status(404).json({
                    message: "Wallet not found",
                    name: name
                });
            }
            var dataString = `{"jsonrpc":"1.0","id":"1","method":"getnewaddress","params":["${name}"]}`;
            requestController.RpcRequest({ chain: "test", wallet: wallet.name }, dataString).then((address) => {
                    console.log("address");
                    console.log(address);
                    if (address.result) {
                        var dataStringPrivKey = `{"jsonrpc":"1.0","id":"1","method":"dumpprivkey","params":["${address.result}"]}`;
                        requestController.RpcRequest({ chain: "test", wallet: wallet.name }, dataStringPrivKey).then((privKey) => {
                                console.log("privKey");
                                console.log(privKey);
                                if (privKey.result) {
                                    const account = new Account({
                                        _id: new mongoose.Types.ObjectId(),
                                        address: address.result,
                                        privateKey: privKey.result,
                                        wallet: wallet._id
                                    });
                                    account.save()
                                        .then(result => {
                                            res.status(201).json({
                                                message: 'Account stored',
                                                createdAccount: {
                                                    _id: result._id,
                                                    address: result.address,
                                                    privateKey: result.privateKey,
                                                    wallet: result.wallet,
                                                    request: {
                                                        type: 'GET',
                                                        url: 'http://localhost:7078/accounts/' + result._id
                                                    }
                                                }
                                            });
                                        })
                                } else {
                                    res.status(address.response.statusCode).json({
                                        error: JSON.parse(address.body).error.message
                                    });
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    } else {
                        res.status(address.response.statusCode).json({
                            error: JSON.parse(address.body).error.message
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
};

exports.Get = (req, res, next) => {
    Account.findById(req.params.accountId)
        .populate('wallet', 'name network notifyUrl')
        .exec()
        .then(account => {
            console.log(account);
            if (!account) {
                return res.status(404).json({
                    message: 'Account not found'
                });
            }
            res.status(200).json({
                account: account,
                request: {
                    type: 'GET',
                    url: 'http://localhost:7078/accounts'
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.Delete = (req, res, next) => {
    Account.deleteOne({ _id: req.params.accountId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Account deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:7078/accounts',
                    data: { walletId: 'ID' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
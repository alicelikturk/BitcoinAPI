const mongoose = require("mongoose");
const Wallet = require("../models/wallet");
const cRequset = require("../customRequest");

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

                // Argument #7 - load_on_startup: true to add wallet to startup list,
                var postData = {
                    wallet: undefined,
                    method: 'createwallet',
                    parameters: [req.body.name, false, false, "", false, false, true]
                }
                cRequset.Request(postData)
                    .then((result) => {
                        if (!result) {
                            return res.status(500).json({
                                error: 'createwallet error'
                            });
                        }
                        const wallet = new Wallet({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name//,
                            // notifyUrl: req.body.notifyUrl,
                            // network: req.body.network
                        });
                        wallet
                            .save()
                            .then(createdWallet => {
                                console.log(createdWallet);
                                res.status(200).json({
                                    message: 'Wallet created',
                                    wallet: {
                                        name: result.name,
                                        message: result.warning
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
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

exports.GetBalance = (req, res, next) => {
    Wallet.findById(req.params.walletId)
        .exec()
        .then(wallet => {
            if (!wallet) {
                return res.status(404).json({
                    message: 'Wallet not found'
                });
            }
            var postData = {
                wallet: wallet.name,
                method: 'getbalance',
                parameters: []
            }
            cRequset.Request(postData)
                .then((result) => {
                    if (!result) {
                        return res.status(500).json({
                            error: 'getbalance error'
                        });
                    }
                    res.status(200).json({
                        wallet: {
                            _Id: wallet._id,
                            name: wallet.name,
                            asset: { name: 'btc', balance: result }
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:7078/wallets/'
                        }
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
    for (const key of Object.keys(req.body)) {
        updateOps[key] = req.body[key];
    }
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
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};
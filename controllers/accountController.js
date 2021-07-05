const mongoose = require("mongoose");
const Account = require("../models/account");
const Wallet = require("../models/wallet");
const colors = require('colors');
const cRequset = require("../customRequest");

exports.List = (req, res, next) => {
    Account.find()
        .select('wallet address privateKey _id')
        .populate('wallet', 'name')
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

exports.WalletAccountList = (req, res, next) => {
    Account.find({ wallet: req.params.walletId })
        .select('wallet address privateKey _id')
        .populate('wallet', 'name')
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

exports.Add = (req, res, next) => {
    const id = req.body.walletId;
    Wallet.findById(id)
        .then(wallet => {
            if (!wallet) {
                return res.status(404).json({
                    message: "Wallet not found",
                    id: id
                });
            }

            var postData = {
                wallet: wallet.name,
                method: 'getnewaddress',
                parameters: []
            }
            cRequset.Request(postData)
                .then((result) => {
                    if (!result) {
                        return res.status(500).json({
                            error: 'getnewaddress error'
                        });
                    }

                    var postData2 = {
                        wallet: wallet.name,
                        method: 'dumpprivkey',
                        parameters: [result]
                    }
                    cRequset.Request(postData2)
                    .then((resultPrivkey) => {
                        if (!resultPrivkey) {
                            return res.status(500).json({
                                error: 'dumpprivkey error'
                            });
                        }
                        const account = new Account({
                            _id: new mongoose.Types.ObjectId(),
                            address: result,
                            privateKey: resultPrivkey,
                            wallet: req.body.walletId
                        });
                        account.save()
                            .then(newAccount => {
                                res.status(201).json({
                                    message: 'Account stored',
                                    createdAccount: {
                                        _id: result._id,
                                        address: newAccount.address,
                                        privateKey: newAccount.privateKey,
                                        wallet: wallet.name,
                                        request: {
                                            type: 'GET',
                                            url: 'http://localhost:7078/accounts/' + result._id
                                        }
                                    }
                                });
                            });
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

exports.GetBalance = (req, res, next) => {
    res.status(200).json({
        message: 'Deprecated',
        request: {
            type: 'GET',
            url: 'http://localhost:7078/wallets/balance/{walletId}'
        }
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
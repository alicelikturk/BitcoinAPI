const mongoose = require("mongoose");
const Account = require("../models/account");
const Wallet = require("../models/wallet");
const colors = require('colors');
const cRequset = require("../customRequest");

exports.IsAddress = (req, res, next) => {
    Wallet.findOne({ name: req.params.wallet })
        .exec()
        .then(wallet => {
            if (!wallet) {
                return res.status(404).json({
                    message: 'Wallet not found'
                });
            }
            var postData = {
                wallet: wallet.name,
                method: 'validateaddress',
                parameters: [req.params.address]
            }
            cRequset.Request(postData)
                .then((result) => {
                    if (!result) {
                        return res.status(500).json({
                            error: 'validateaddress error'
                        });
                    }
                    return res.status(200).json({
                        result: result.isvalid,
                        address: result.address
                    });
                });
        });
};

exports.SendTo = (req, res, next) => {
    Wallet.findOne({ name: req.params.wallet })
        .exec()
        .then(wallet => {
            if (!wallet) {
                return res.status(404).json({
                    message: 'Wallet not found'
                });
            }
            var postData1 = {
                wallet: wallet.name,
                method: 'getbalance',
                parameters: []
            }
            cRequset.Request(postData1)
                .then((resultBalance) => {
                    if (!resultBalance) {
                        return res.status(500).json({
                            error: 'getbalance error'
                        });
                    }
                    var postData2 = {
                        wallet: undefined,
                        method: 'estimatesmartfee',
                        parameters: [6,"ECONOMICAL"]
                    }
                    cRequset.Request(postData2)
                        .then((resultFee) => {
                            if (!resultFee) {
                                return res.status(500).json({
                                    error: 'estimatesmartfee error'
                                });
                            }
                            //  var totalAmount = req.body.amounts[1].reduce((a, b) => a + b, 0);
                            console.log(colors.bgGreen.white(req.body.amounts[1]));
                             // if (resultBalance < resultFee + totalAmount) {
                            //     console.log("Insufficient funds for fee + value");
                            //     return res.status(404).json({
                            //         txHash: null,
                            //         error: "Insufficient funds for fee + value"
                            //     });
                            // }
                            var postData3 = {
                                wallet: wallet.name,
                                method: 'sendmany',
                                parameters: ["",req.body.amounts]
                            }
                            cRequset.Request(postData3)
                                .then((resultSend) => {
                                    if (!resultSend) {
                                        return res.status(500).json({
                                            error: 'sendmany error'
                                        });
                                    }
                                    return res.status(200).json({
                                        txHash: resultSend
                                    });
                                });
                        });

                });

        });
};



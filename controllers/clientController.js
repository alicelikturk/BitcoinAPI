const mongoose = require("mongoose");
const Client = require("../models/client");

exports.List = (req, res, next) => {
    Client.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                clients: docs.map(doc => {
                    return {
                        client: doc,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:7078/clients/' + doc._id
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
    if (req.body.isActive) {
        Client.updateMany({ isActive: true }, {
                isActive: false
            })
            .exec()
            .then(result => {
                console.log("other clients deactived");
                const client = new Client({
                    _id: new mongoose.Types.ObjectId(),
                    name: req.body.name,
                    isActive: req.body.isActive,
                    mainnet: req.body.mainnet,
                    testnet: req.body.testnet
                });
                client.save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Client stored. Please restart the Bitcoin API server',
                            createdClient: {
                                client: result,
                                request: {
                                    type: 'GET',
                                    url: 'http://localhost:7078/clients/' + result._id
                                }
                            }
                        });
                    })
            });
    } else {
        return res.status(500).json({
            message: 'Please add client that will be activated. The client must be active.'
        });
    }
};

exports.Get = (req, res, next) => {
    Client.findById(req.params.clientId)
        .exec()
        .then(client => {
            if (!client) {
                return res.status(404).json({
                    message: 'Client not found'
                });
            }
            res.status(200).json({
                client: client,
                request: {
                    type: 'GET',
                    url: 'http://localhost:7078/clients'
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
    Client.deleteOne({ _id: req.params.clientId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Client deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:7078/clients',
                    data: {
                        name: 'String',
                        mainnet: 'String',
                        testnet: 'String'
                    }
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

exports.Update = (req, res, next) => {
    const updateOps = {};
    for (const key of Object.keys(req.body)) {
        updateOps[key] = req.body[key];
    }
    if (!updateOps["name"]) {
        return res.status(404).json({
            message: 'name is required'
        });
    }
    console.log("updateOps[isActive]");
    console.log(updateOps["isActive"]);
    Client.updateOne({ name: updateOps["name"] }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            if (updateOps["isActive"]) {
                Client.updateMany({ isActive: true, name: { $ne: updateOps["name"] } }, {
                        isActive: false
                    })
                    .exec()
                    .then(resultUpdateMany => {
                        console.log("resultUpdateMany");
                        console.log(resultUpdateMany);
                        console.log("other clients deactived");

                    });
            }
            console.log("result");
            console.log(result);
            if (result.n > 0) {
                res.status(200).json({
                    message: 'Client updated. Please restart the Bitcoin API server',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:7078/clients/'
                    }
                });
            } else {
                res.status(200).json({
                    message: 'Client couldn\'t updated. Please try again later',
                    request: {
                        type: 'GET',
                        url: 'http://localhost:7078/clients/'
                    }
                });

            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

};
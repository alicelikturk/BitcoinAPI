const mongoose = require("mongoose");
const Client = require("../models/client");
const colors = require('colors');

const request = require("request");


const headers = {
    "Content-Type": "application/json;"
};

// var requestOption = {
//     chain: "",
//     wallet: ""
// };
const RpcRequest = (requestOption, dataString, wallet) => {
    return new Promise((resolve, reject) => {
        Client.find({ isActive: true })
            .exec()
            .then(docs => {
                var provider = "";
                if (docs.length > 0) {
                    if (requestOption.chain === "main") {
                        provider = docs[0].mainnet;
                    } else {
                        provider = docs[0].testnet;
                    }

                    if (requestOption.wallet) {
                        provider += "/wallet/" + requestOption.wallet;
                    }

                    var rpcUser = docs[0].rpcUser || "alie";
                    var rpcPassword = docs[0].rpcPassword || "Sanane1234";
                    var options = {
                        url: `http://${rpcUser}:${rpcPassword}@${provider}`,
                        method: "POST",
                        headers: headers,
                        body: dataString
                    };
                    callback = (error, response, body) => {

                        if (error) {
                            console.log(colors.red("ERROR"));
                            console.log(error);
                            reject(JSON.parse(error));
                        } else {
                            if (response.statusCode == 200) {
                                console.log(colors.green("SUCCESS"));
                                const data = JSON.parse(body);
                                resolve(data);
                            } else if (response.statusCode != 200) {
                                console.log(colors.yellow("FAILED"));
                                console.log(colors.yellow(body));
                                reject(JSON.parse(body));
                            }
                        }
                    };
                    request(options, callback);
                }
            });

    });
};


module.exports.RpcRequest = RpcRequest;
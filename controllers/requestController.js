const mongoose = require("mongoose");
const Client = require("../models/client");
const colors = require('colors');

const request = require("request");


const headers = {
  "content-type": "text/plain;"
};


const RpcRequest = (chain, dataString) => {
  console.log("dataString");
  console.log(dataString);
  return new Promise((resolve, reject) => {
    Client.find({ isActive: true })
      .exec()
      .then(docs => {
        var provider = "";
        if (docs.length > 0) {
          if (chain === "main") {
            provider = docs[0].mainnet;
          } else {
            provider = docs[0].testnet;
          }
          var rpcUser = docs[0].rpcUser || "hungry-banach";
          var rpcPassword = docs[0].rpcPassword || "darn-hasty-wilt-action-tidy-popper";
          var options = {
            url: `https://${rpcUser}:${rpcPassword}@${provider}`,
            method: "POST",
            headers: headers,
            body: dataString
          };
          callback = (error, response, body) => {

            if (!error && response.statusCode == 200) {
              const data = JSON.parse(body);
              resolve(data);
            } else if (response.statusCode != 200) {
              resolve({ response: response, body: body });
            }
            reject(error);
          };
          request(options, callback);
        }
      });

  });
};


module.exports.RpcRequest = RpcRequest;
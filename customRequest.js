const request = require("request");
const colors = require('colors');

const Request = (postData) => {
    console.log('postData');
    console.log(postData);

    return new Promise((resolve, reject) => {

        request({
            // uri: 'http://localhost:7078/'+postData.wallet+'/',
            uri: 'http://localhost:7078/tests',
            method: "POST",
            body: JSON.stringify(postData),
            rejectUnauthorized: false,
            headers: {
                'Content-Type': 'application/json'
            }
        }, function (error, response, body) {
            console.log(colors.cyan('Request "createwallet" sent'));
            if (error) {
                console.log(colors.magenta('Request "createwallet" has an error: \n' +
                    JSON.stringify(error)));
            } else {
                var result;
                if (postData.method === 'createwallet') {
                    result = {
                        name: 'WalletName',
                        warning: 'warning'
                    };
                    console.log(colors.magenta('Request "createwallet" successed'));
                    console.log(JSON.parse(result));
                }
                else if (postData.method === 'getbalance') {
                    result = 11.10045200;
                    console.log(colors.magenta('Request "getbalance" successed'));
                    console.log(result);
                } else if (postData.method === 'getnewaddress') {
                    result = "3E8ociqZa9mZUSwGdSmAEMAoAxBK3FNDcd";
                    console.log(colors.magenta('Request "getnewaddress" successed'));
                    console.log(result);
                }
                else if (postData.method === 'dumpprivkey') {
                    result = "a9mZUSwGdSmAEMAoAxE8ociqZa9mZUSwGdSmAEMAoAxBK3FNDcdmAEMAoAxBK3F";
                    console.log(colors.magenta('Request "dumpprivkey" successed'));
                    console.log(result);
                }
                else if (postData.method === 'validateaddress') {
                    result = {        
                        isvalid : true,
                        address : postData.parameters[0]
                      };
                    console.log(colors.magenta('Request "validateaddress" successed'));
                    console.log(result)
                }
                else if (postData.method === 'estimatesmartfee') {
                    result = {        
                        feerate : 0.005,
                        blocks : 2
                      };
                    console.log(colors.magenta('Request "estimatesmartfee" successed'));
                    console.log(result)
                }
                else if (postData.method === 'sendmany') {
                    result = {        
                        hex :"txhash-iqZa9mZUSwGdSmAEMAoAxiqZa9mZUSwGdSmAEMAoAxiqZa9mZUSwGdSmAEMAoAxiqZa9mZUSwGdSmAEMAoAx"
                      };
                    console.log(colors.magenta('Request "sendmany" successed'));
                    console.log(result)
                }
                resolve(result);
            }
        });
    });
};


module.exports.Request = Request;
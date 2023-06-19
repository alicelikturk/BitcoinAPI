const request = require("request");
const colors = require('colors');

const Request = (postData) => {
    console.log('postData');
    console.log(postData);

    return new Promise((resolve, reject) => {
        var username = 'test';
        var password = "test12";
        var url = "http://127.0.0.1";
        var port = 18332;

        console.log(colors.cyan(postData));
        console.log(colors.cyan(JSON.stringify(postData)));

        request({
            uri: url + ':' + port,
            method: "POST",
            body: JSON.stringify(postData),
            rejectUnauthorized: false,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Basic " + new Buffer(username + ":" + password).toString("base64")
            }
        }, function(error, response, body) {
            console.log(colors.cyan('Request "createwallet" sent'));
            if (error) {
                console.log(colors.magenta('Request "createwallet" has an error:'));
                console.log(colors.magenta(JSON.stringify(error)));
            } else {
                console.log(colors.bgCyan.yellow(response.body));
                resolve(response.body);
            }
        });
    });
};


module.exports.Request = Request;

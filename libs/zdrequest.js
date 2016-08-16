const Promise = require('promise');
const request = require('request');

/**
 * Function to create a request to zendesk
 * Make GET and POST requests to uris with singular or plural names
 */

var zdrequest = function (account, object, method, data) {
  return new Promise(function(fufill, reject){
    var dataToSend = {};
    var options = {
      headers: {
        Authorization: 'Basic ' + new Buffer(account.email + '/token:' + account.token).toString('base64')
      },
      method: method
    };

    if(method == 'GET') {
      options.url = `https://${account.subdomain}.zendesk.com/api/v2/` + object.name + '.json';
      options.forever = true;
    }else if(method == 'POST') {
      dataToSend[object.singular] = data;
      options.url = `https://${account.subdomain}.zendesk.com/api/v2/` + object.name + '.json';
      options.json = dataToSend;
    }

    request(options, function(err, res, body){
      if (err) { reject(err); }
      fufill(body);
    });
  });
};

module.exports = zdrequest;
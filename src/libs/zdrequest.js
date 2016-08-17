const Promise = require('promise');
const request = require('request');

var zdrequest = {

  get: function(account, uri) {

    var options = {
      headers: {
        Authorization: 'Basic ' + new Buffer(account.email + '/token:' + account.token).toString('base64')
      },
      url: `https://${account.subdomain}.zendesk.com/api/v2/` + uri + '.json',
      method: 'GET',
      forever: true
    };

    return new Promise(function(fufill, reject){
      request(options, function(err, res, body){
        if (err) { reject(err); }
        fufill(body);
      });
    });

  },

  post: function(account, uri, singular, data) {

    var options = {
      headers: {
        Authorization: 'Basic ' + new Buffer(account.email + '/token:' + account.token).toString('base64')
      },
      url: `https://${account.subdomain}.zendesk.com/api/v2/` + uri + '.json',
      method: 'POST',
      json: {}
    };

    options.json[singular] = data;

    return new Promise(function(fufill, reject){
      request(options, function(err, res, body){
        if (err) { reject(err); }
        fufill(body);
      });
    });

  }

}

module.exports = zdrequest;
const Promise = require('promise');
const request = require('request');
const zdrequest = require('../libs/zdrequest');
const accountA = require('../config/config').accountA;
const accountB = require('../config/config').accountB;

var createTicketForms = function (object, objectToClone) {
  setTimeout(function(){
    // Array to store all the names of the ticket fields found from accountA
    var foundTicketFieldsPromises = [];
    var foundTicketFields = [];
    var accountBTicketFields = [];

    // Array to store the new ticket field ids for the current form
    var newTicketFields = [];

    getAllTicketFieldsFromAccountB().then(function(a){
      accountBTicketFields = a;

      // Get all the ticket_field_ids from the ticket form
      objectToClone.ticket_field_ids.forEach(function(ticketFieldId){
        foundTicketFieldsPromises.push(getTicketFieldFromAccountA(ticketFieldId));
      });

      Promise.all(foundTicketFieldsPromises).then(function(result){
        foundTicketFields = result;
      }).then(function(){
        foundTicketFields.forEach(function(ticketFieldA){
          accountBTicketFields.forEach(function(ticketFieldB){
          if(ticketFieldB.raw_title == ticketFieldA) {
              newTicketFields.push(ticketFieldB.id);
            }
          });
        });
        objectToClone.ticket_field_ids = newTicketFields;
        zdrequest(accountB, object, 'POST', objectToClone).then(function(){
          console.log(`${object.title} cloned!`);
        });
      });
    });
  }.bind(this), 2000);
}

function getTicketFieldFromAccountA(id) {
  return new Promise(function(fufill, reject){
    var options = {
      headers: {
        Authorization: 'Basic ' + new Buffer(accountA.email + '/token:' + accountA.token).toString('base64')
      },
      url: `https://${accountA.subdomain}.zendesk.com/api/v2/ticket_fields/${id}.json`,
      method: 'GET'
    };

    request(options, function(err, res, body){
      if (err) { reject(err); }
      fufill(JSON.parse(body).ticket_field.raw_title);
    });
  });
};

function getAllTicketFieldsFromAccountB() {
  return new Promise(function(fufill, reject){
    var options = {
      headers: {
        Authorization: 'Basic ' + new Buffer(accountB.email + '/token:' + accountB.token).toString('base64')
      },
      url: `https://${accountB.subdomain}.zendesk.com/api/v2/ticket_fields.json`,
      method: 'GET'
    };

    request(options, function(err, res, body){
      if (err) { reject(err); }
      fufill(JSON.parse(body).ticket_fields);
    });
  });
};

module.exports = createTicketForms;
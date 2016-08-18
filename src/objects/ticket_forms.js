const Promise = require('promise');
const request = require('request');
const zdrequest = require('../libs/zdrequest');

var TicketForms = function(accounts) {

  this.create = function(object, objectToClone) {

    return new Promise(function(fufill, reject){
      setTimeout(function(){

        // Array to store all the names of the ticket fields found from accountA
        var accountBTicketFields = [];
        var foundTicketFieldsPromises = [];
        var foundTicketFields = [];

        // Array to store the new ticket field ids for the current form
        var newTicketFields = [];

        
        zdrequest.get(accounts.b, 'ticket_fields').then(function(x){
          accountBTicketFields = JSON.parse(x).ticket_fields;
        }).then(function(){

          // Get all the ticket_field_ids from the ticket form
          objectToClone.ticket_field_ids.forEach(function(ticketFieldId){
            foundTicketFieldsPromises.push(zdrequest.get(accounts.a, `ticket_fields/${ticketFieldId}`));
          });

        }).then(function() {

          Promise.all(foundTicketFieldsPromises).then(function(result){
            foundTicketFields = result;
          }).then(function(){

            foundTicketFields.forEach(function(ticketFieldA){

              accountBTicketFields.forEach(function(ticketFieldB){

                if(ticketFieldB.raw_title == JSON.parse(ticketFieldA).ticket_field.raw_title) {
                  newTicketFields.push(ticketFieldB.id);
                }

              });

            });

            objectToClone.ticket_field_ids = newTicketFields;

            fufill(zdrequest.post(accounts.b, object.name, object.singular, objectToClone));

          });

        });

      }.bind(this), 4000);
    });

  };

};

module.exports = TicketForms;
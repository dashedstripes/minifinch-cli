const Promise = require('promise');
const readlineSync = require('readline-sync');
const request = require('request');
const models = require('./models');

let accountA = {
  subdomain: 'z3nminifincha',
  email: 'agray@zendesk.com',
  token: 'snm5S8KZ8ewNV3FajbccERTSaIyN5Y2q4lyxo45W'
};

let accountB = {
  subdomain: 'z3nminifinchb',
  email: 'agray@zendesk.com',
  token: 'JhSUuQRmQxK6Ho4zjqy8buuijkMc1UXEsmDuliab'
}

let selectedObjects = [];
let objectsToCreate = [];

/**
 * Ask user for objects to clone,
 * push all selected objects to the selectedObjects array
 */ 

for(var object in models){
  var response = readlineSync.question(`${models[object].title}? (y/n) `);
  if(response == 'y') {
    selectedObjects.push(models[object]);
  }
}

/** 
 * Loop through each selected object
 * add objects to create with dependencies
 * starting with objects with no dependencies and
 * finishing with ones with the most dependencies
*/

selectedObjects.forEach(function(object){
  // if object is not in objectsToCreate array
  if(objectsToCreate.indexOf(object) == -1){
    // check if object has any dependencies
    if(object.dependencies.length != 0) {
      // Loop through each dependency
      object.dependencies.forEach(function(dependency){
        var currentDependency = findObjectFromDependency(dependency);
        // if dependency is not in objectsToCreate
        if(objectsToCreate.indexOf(currentDependency) == -1){
          objectsToCreate.push(currentDependency);
        }
      });
      objectsToCreate.push(object);
    }else{
      objectsToCreate.push(object);
    }
  }
});

/**
 * Using the dependency name from an object, 
 * find the original object from models
 */
function findObjectFromDependency(dependency) {
  for(var object in models){
    if(models[object].name == dependency) {
      return models[object];
    }
  }
}

/**
 * Using objectsToCreate, clone chosen objects...
 */

objectsToCreate.forEach(function(object){
  var toClone = [];
  zdrequest(accountA, object, 'GET').then(function(result){
    toClone = JSON.parse(result)[object.name];
  }).then(function(){
    toClone.forEach(function(objectToClone){
      /**
       * Logic for cloning a ticket form
       */
      console.log(objectToClone);
      if(object.name == 'ticket_forms'){
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
            // zdrequest(accountB, object, 'POST', objectToClone).then(function(){
            //   console.log(`${object.title} cloned!`); 
            // });
          });
        });
      }else{
        // zdrequest(accountB, object, 'POST', objectToClone).then(function(){
        //   console.log(`${object.title} cloned!`);    
        // });
      }
    });
  });
});

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
      if (err) { console.rejeectlog(err); }
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

/**
 * Function to create a request to zendesk
 */

function zdrequest(account, object, method, data) {
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
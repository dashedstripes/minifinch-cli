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
      createNewObject(accountB, object, objectToClone);
    });
  }).then(function(){
    console.log(`${object.title} cloned!`);
  });
});

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

/**
 * Create a new object from account A to account B.
 * Provides logic for complicated objects with dependencies.
 */

function createNewObject(account, object, data) {
  if(object.name == 'ticket_forms'){
    createTicketForms(account, object, data);
  }else{
    // zdrequest(account, object, 'POST', data);
  }
};

function createTicketForms(account, object, data) {
  // Placeholder for all the original ticket fields
  var originalTicketFields = [];
  // Overriding account with accountA
  zdrequest(accountA, object, 'GET').then(function(result) {
    // Get original ticket field ids
    return JSON.parse(result).ticket_forms;
  }).then(function(originalTicketForms){
    originalTicketForms.forEach(function(currentTicketForm){
      // Loop through each of the original ids
      currentTicketForm.ticket_field_ids.forEach(function(currentTicketFieldId){
        /**
         * Make a request to account A to create an array of the original
         * ticket field names
         */
        var options = {
          headers: {
            Authorization: 'Basic ' + new Buffer(accountA.email + '/token:' + accountA.token).toString('base64')
          },
          url: `https://${accountA.subdomain}.zendesk.com/api/v2/ticket_fields/${currentTicketFieldId}.json`,
          method: 'GET'
        };
        request(options, function(err, res, body){
          if (err) { console.log(err); }
          // body is all of the found ticket fields from account A
          originalTicketFields.push(JSON.parse(body).ticket_field.raw_title);
        });
      });
    });
  });
}
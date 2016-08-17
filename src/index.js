const Promise = require('promise');
const readlineSync = require('readline-sync');
const request = require('request');
const zdrequest = require('./libs/zdrequest');
const models = require('./config/models');
const TicketForms = require('./objects/ticket_forms');

 var Minifinch = function () {

  let accounts = {
    a: {
      subdomain: 'z3nminifincha',
      email: 'agray@zendesk.com',
      token: 'snm5S8KZ8ewNV3FajbccERTSaIyN5Y2q4lyxo45W'
    },
    b: {
      subdomain: 'z3nminifinchb',
      email: 'agray@zendesk.com',
      token: 'JhSUuQRmQxK6Ho4zjqy8buuijkMc1UXEsmDuliab'
    }
  };

  let selectedObjects = [];
  let objectsToCreate = [];

  let ticketForms;

  this.start = function() {
    ticketForms = new TicketForms(accounts);

    getAccountInfo();
    getSelectionFromUser();
    organizeDependencies();
    createObjects();
  };

  function getAccountInfo() {
    console.log(`                                 
 _____ _     _ ___ _         _   
|     |_|___|_|  _|_|___ ___| |_ 
| | | | |   | |  _| |   |  _|   |
|_|_|_|_|_|_|_|_| |_|_|_|___|_|_|
                                 `);
    console.log('First, enter the details of the account you want to clone from:');
    console.log('');

    accounts.a.subdomain = readlineSync.question('What is the subdomain? ');
    accounts.a.email = readlineSync.question('What is the email? ');
    accounts.a.token = readlineSync.question('What is the token? ');

    console.log('');
    console.log('Next, enter the details for the account you want to clone to:')
    console.log('');

    accounts.b.subdomain = readlineSync.question('What is the subdomain? ');
    accounts.b.email = readlineSync.question('What is the email? ');
    accounts.b.token = readlineSync.question('What is the token? ');
    console.log('');
    
    console.log('Now, select which objects you would like to clone:');
  };

  function getSelectionFromUser() {
    for(let object in models){
      let response = readlineSync.question(`${models[object].title}? (y/n) `);
      if(response == 'y') {
        selectedObjects.push(models[object]);
      }
    }
  };

  function organizeDependencies() {
    selectedObjects.forEach(function(object){
      if(objectsToCreate.indexOf(object) == -1){
        if(object.dependencies.length != 0) {
          object.dependencies.forEach(function(dependency){
            var currentDependency = findObjectFromDependency(dependency);
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
  };

  function findObjectFromDependency(dependency) {
    for(var object in models){
      if(models[object].name == dependency) {
        return models[object];
      }
    }
  };

  function createObjects() {
    objectsToCreate.forEach(function(object){
      var toClone = [];
      zdrequest.get(accounts.a, object.name).then(function(result){
        toClone = JSON.parse(result)[object.name];
      }).then(function(){
        toClone.forEach(function(objectToClone){
          if(object.name == 'ticket_forms'){
            ticketForms.create(object, objectToClone);
          }else{
            zdrequest.post(accounts.b, object.name, object.singular, objectToClone).then(function(){
              console.log(`${object.title} cloned!`);   
            });
          }
        });
      });
    });
  }

};

module.exports = Minifinch;
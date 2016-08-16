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
    getSelectionFromUser();
    organizeDependencies();
    createObjects();
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
      zdrequest(accounts.a, object, 'GET').then(function(result){
        toClone = JSON.parse(result)[object.name];
      }).then(function(){
        toClone.forEach(function(objectToClone){
          if(object.name == 'ticket_forms'){
            ticketForms.create(object, objectToClone);
          }else{
            zdrequest(accounts.b, object, 'POST', objectToClone).then(function(){
              console.log(`${object.title} cloned!`);   
            });
          }
        });
      });
    });
  }

};

module.exports = Minifinch;
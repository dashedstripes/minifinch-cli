const Promise = require('promise');
const readlineSync = require('readline-sync');
const request = require('request');
const zdrequest = require('./libs/zdrequest');
const models = require('./config/models');
const createTicketForms = require('./objects/ticket_forms');

let minifinch = {
  accounts: {
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
  },

  selectedObjects: [],
  objectsToCreate: [],

  start: function() {
    this.getSelectionFromUser();
    this.organizeDependencies();
    // this.createObjects();
  },

  getSelectionFromUser: function() {
    for(let object in models){
      let response = readlineSync.question(`${models[object].title}? (y/n) `);
      if(response == 'y') {
        this.selectedObjects.push(models[object]);
      }
    }
  },

  organizeDependencies: function() {
    this.selectedObjects.forEach(function(object){
      if(this.objectsToCreate.indexOf(object) == -1){
        if(object.dependencies.length != 0) {
          object.dependencies.forEach(function(dependency){
            var currentDependency = this.findObjectFromDependency(dependency);
            if(this.objectsToCreate.indexOf(currentDependency) == -1){
              this.objectsToCreate.push(currentDependency);
            }
          }.bind(this));
          this.objectsToCreate.push(object);
        }else{
          this.objectsToCreate.push(object);
        }
      }
    }.bind(this));
  },

  findObjectFromDependency: function(dependency) {
    for(var object in models){
      if(models[object].name == dependency) {
        return models[object];
      }
    }
  },

  createObjects: function() {
    this.objectsToCreate.forEach(function(object){
      var toClone = [];
      zdrequest(this.accounts.a, object, 'GET').then(function(result){
        toClone = JSON.parse(result)[object.name];
      }).then(function(){
        toClone.forEach(function(objectToClone){
          if(object.name == 'ticket_forms'){
            createTicketForms(object, objectToClone);
          }else{
            zdrequest(this.accounts.b, object, 'POST', objectToClone).then(function(){
              console.log(`${object.title} cloned!`);   
            });
          }
        });
      });
    });
  }
}

module.exports = minifinch;
// Dependencies
const Promise = require('promise');
const readlineSync = require('readline-sync');
const request = require('request');
// Custom dependencies
const zdrequest = require('./libs/zdrequest');
const models = require('./config/models');
const TicketForms = require('./objects/ticket_forms');

var Minifinch = function () {

  // Account details to be filled in by user
  let accounts = {
    a: {
      subdomain: process.env.MINIFINCH_A_SUBDOMAIN,
      email: process.env.MINIFINCH_A_EMAIL,
      token: process.env.MINIFINCH_A_TOKEN
    },
    b: {
      subdomain: process.env.MINIFINCH_B_SUBDOMAIN,
      email: process.env.MINIFINCH_B_EMAIL,
      token: process.env.MINIFINCH_B_TOKEN
    }
  };

  // Objects the user has selected
  let selectedObjects = [];
  // All objects and dependencies that will be created
  let objectsToCreate = [];

  // Store ticket forms object in ticketForms variable
  let ticketForms;

  // Start function - minifinch is called from here
  this.start = function(isDev) {
    ticketForms = new TicketForms(accounts);

    if(!isDev) {
      getAccountInfo();
    }
    
    getSelectionFromUser();
    organizeDependencies();
    createObjects();
  };


  // Ask user for account info
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

  // Iterate through each model and get selection from user
  function getSelectionFromUser() {
    for(let object in models){
      let response = readlineSync.question(`${models[object].title}? (y/n) `);
      if(response == 'y') {
        selectedObjects.push(models[object]);
      }
    }
  };

  /**
   * Get any dependencies from objects the user has selected and
   * save them into objectsToCreate
   */
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

  /**
   * Get the object that matches the dependency name
   * @param {string} dependency
   */
  function findObjectFromDependency(dependency) {
    for(var object in models){
      if(models[object].name == dependency) {
        return models[object];
      }
    }
  };

  // Create all objects from objectsToCreate array
  function createObjects() {
    var objectsToCreatePromises = [];
    objectsToCreate.forEach(function(object){
      var toClone = [];
      // Get JSON list of current object from accountA
      zdrequest.get(accounts.a, object.name).then(function(result){
        toClone = JSON.parse(result)[object.name];
      }).then(function(){
        toClone.forEach(function(objectToClone){
          if(object.name == 'ticket_forms'){
            objectsToCreatePromises.push(ticketForms.create(object, objectToClone));
          }else{
            objectsToCreatePromises.push(zdrequest.post(accounts.b, object.name, object.singular, objectToClone));
          }
        });
      }).then(function() {
        Promise.all(objectsToCreatePromises).then(function(){
          console.log(`${object.title} cloned!`); 
        });
      });
    });
  }

};

module.exports = Minifinch;
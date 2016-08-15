const Promise = require('promise');
const readlineSync = require('readline-sync');
const request = require('request');
const zdrequest = require('./libs/zdrequest');
const models = require('./config/models');
const accountA = require('./config/config').accountA;
const accountB = require('./config/config').accountB;

const createTicketForms = require('./objects/ticket_forms');

let selectedObjects = [];
let objectsToCreate = [];

// Start minifinch
init();

/**
 * Initialization function
 */
function init() {
  getUserInput();
  createDependencyTree();
  findObjectFromDependency();
  createObjects();
};

/**
 * Ask user for objects to clone,
 * push all selected objects to the selectedObjects array
 */ 

function getUserInput() {
  for(var object in models){
    var response = readlineSync.question(`${models[object].title}? (y/n) `);
    if(response == 'y') {
      selectedObjects.push(models[object]);
    }
  }
}

/** 
 * Loop through each selected object
 * add objects to create with dependencies
 * starting with objects with no dependencies and
 * finishing with ones with the most dependencies
*/

function createDependencyTree() {
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
}

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
function createObjects() {
  objectsToCreate.forEach(function(object){
    var toClone = [];
    zdrequest(accountA, object, 'GET').then(function(result){
      toClone = JSON.parse(result)[object.name];
    }).then(function(){
      toClone.forEach(function(objectToClone){
        /**
         * Logic for cloning a ticket form
         */
        if(object.name == 'ticket_forms'){
          createTicketForms(object, objectToClone);
        }else{
          zdrequest(accountB, object, 'POST', objectToClone).then(function(){
            console.log(`${object.title} cloned!`);   
          });
        }
      });
    });
  });
}
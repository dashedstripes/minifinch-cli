const readlineSync = require('readline-sync');
const models = require('./models');

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

console.log('Objects to create:');
console.log(objectsToCreate);


"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mendixplatformsdk_1 = require("mendixplatformsdk");
async function main() {
  const client = new mendixplatformsdk_1.MendixPlatformClient();
  const app = await client.getApp("fa517ca0-7b0c-4db6-9b64-039cfed357e7");
  const workingCopy = await app.createTemporaryWorkingCopy("main");
  const model = await workingCopy.openModel();
  const fs = require("fs");
  const modulesCreatedByDevelopers = model.allModules().filter((module) => module.fromAppStore === false);
  fs.writeFileSync("modulesCreatedByDevelopers.json", JSON.stringify(modulesCreatedByDevelopers, null, 2));
  let entitiesAndAssociations = [];
  const getProjectEntitiesAndAssociations = async (modules, index) => {
    if (modules[index] === undefined || modules[index] === null) {
      fs.writeFileSync("EntitiesAndAssociationsV.json", JSON.stringify(entitiesAndAssociations, null, 2));
      return entitiesAndAssociations;
    }
    const getModule = modules[index];
    const loadModule = await getModule.domainModel.load();
    const entities = loadModule.entities.map((entity) => entity.toJSON());
    const associations = loadModule.associations.map((association) => association.toJSON());
    const crossAssociations = loadModule.crossAssociations.map((crossAssociation) => crossAssociation.toJSON());
    //combine all entites together then all associations together then all cross associations together then push to array
    entitiesAndAssociations = [
      ...entitiesAndAssociations,
      { entities: entities, associations: associations, crossAssociations: crossAssociations },
    ];
    return getProjectEntitiesAndAssociations(modules, index + 1);
  };
  await getProjectEntitiesAndAssociations(modulesCreatedByDevelopers, 0);

  model.closeConnection();
  return entitiesAndAssociations;
  //close connection
}
exports.main = main;

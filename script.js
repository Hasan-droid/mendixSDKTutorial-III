"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mendixplatformsdk_1 = require("mendixplatformsdk");
async function main(token, apiId) {
  mendixplatformsdk_1.setPlatformConfig({
    mendixToken: token,
  });
  const client = new mendixplatformsdk_1.MendixPlatformClient();
  const app = await client.getApp(apiId);
  const workingCopy = await app.createTemporaryWorkingCopy("main");
  const model = await workingCopy.openModel();

  const modulesCreatedByDevelopers = model.allModules().filter((module) => module.fromAppStore === false);
  let entitiesAndAssociations = [];
  const getProjectEntitiesAndAssociations = async (modules, index) => {
    if (modules[index] === undefined || modules[index] === null) {
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

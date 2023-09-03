import { domainmodels } from "mendixmodelsdk";
import { MendixPlatformClient, OnlineWorkingCopy } from "mendixplatformsdk";
import { isModuleReference } from "typescript";

async function main() {
  const client = new MendixPlatformClient();
  const app = await client.getApp("fa517ca0-7b0c-4db6-9b64-039cfed357e7");

  const workingCopy = await app.createTemporaryWorkingCopy("main");
  const model = await workingCopy.openModel();

  const fs = require("fs");

  const modulesCreatedByDevelopers = model.allModules().filter((module) => module.fromAppStore === false);
  fs.writeFileSync("modulesCreatedByDevelopers.json", JSON.stringify(modulesCreatedByDevelopers, null, 2));

  let entitiesAndAssociations = [] as any;

  const getProjectEntitiesAndAssociations = async (modules: any, index: any) => {
    if (modules[index] === undefined || modules[index] === null) {
      fs.writeFileSync("EntitiesAndAssociations.json", JSON.stringify(entitiesAndAssociations, null, 2));
      return entitiesAndAssociations;
    }
    const getModule = modules[index];
    const loadModule = await getModule.domainModel.load();
    const entities = loadModule.entities.map((entity: any) => entity.toJSON());
    const associations = loadModule.associations.map((association: any) => association.toJSON());
    const crossAssociations = loadModule.crossAssociations.map((crossAssociation: any) =>
      crossAssociation.toJSON()
    );
    //combine all entites together then all associations together then all cross associations together then push to array
    entitiesAndAssociations = [
      ...entitiesAndAssociations,
      { entities: entities, associations: associations, crossAssociations: crossAssociations },
    ];
    getProjectEntitiesAndAssociations(modules, index + 1);
  };
  getProjectEntitiesAndAssociations(modulesCreatedByDevelopers, 0);
}

main().catch(console.error);

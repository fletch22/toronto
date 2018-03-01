import databaseService from './databaseService';

class DatabaseConstructionService {
  insertData(entity, dbModel) {
    dbModel.userData.forEach((record) => {
      entity.create(record);
    });
  }

  async createDatabase(databaseModel) {
    await databaseService.createDatabase(databaseModel.databaseName);
    databaseService.openConnection(databaseModel.databaseName);

    databaseModel.dbModels.forEach((dbModel) => {
      const entity = databaseService.define(dbModel.tableName, dbModel.definedModel);
      this.insertData(entity, dbModel);
    });

    // Act
    await databaseService.sync();
  }
}

export default new DatabaseConstructionService();

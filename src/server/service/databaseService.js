import Sequelize from 'sequelize';

class DatabaseService {
  constructor() {
    this.openConnection('mysql');
  }

  closeConnection() {
    if (!!this.sequelize) {
      this.sequelize.close();
    }
  }

  openConnection(databaseName) {
    this.sequelize = new Sequelize(databaseName, 'root', 'rumgen999', {
      host: 'localhost',
      dialect: 'mysql',
      logging: console.log,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }

  async testConnection() {
    return await this.sequelize.authenticate();
  }

  async listTables() {
    return await this.sequelize.queryInterface.showAllSchemas({});
  }

  async createDatabase(databaseName) {
    return await this.sequelize.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`, { type: this.sequelize.QueryTypes.RAW });
  }

  async listDatabases() {
    const result = await this.sequelize.query('SHOW DATABASES', { type: this.sequelize.QueryTypes.RAW });
    return result[0].map((databaseObj) => databaseObj.Database);
  }

  async dropDatabase(databaseName) {
    return await this.sequelize.query(`DROP DATABASE IF EXISTS ${databaseName}`, { type: this.sequelize.QueryTypes.RAW });
  }

  async sync() {
    return await this.sequelize.sync();
  }

  define(modelName, obj) {
    this.sequelize.define(modelName, obj);
  }
}

export default new DatabaseService();



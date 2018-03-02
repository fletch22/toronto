import Sequelize from 'sequelize';
import { config } from '../config/config.js';

console.log(JSON.stringify(config));

class DatabaseService {
  constructor() {
    console.log('XXXX');
    this.openConnection(config.databaseName);
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
      },
      define: {
        freezeTableName: true
      }
    });
  }

  async testConnection() {
    return await this.sequelize.authenticate();
  }

  async listTables() {
    return await this.sequelize.queryInterface.showAllSchemas({});
  }

  async sync() {
    return await this.sequelize.sync();
  }

  define(modelName, obj) {
    return this.sequelize.define(modelName, obj);
  }
}

export default new DatabaseService();



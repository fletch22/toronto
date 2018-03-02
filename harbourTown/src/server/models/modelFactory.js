import sequelize from 'sequelize';
import databaseService from '../service/databaseService';

class ModelsFactory {
    constructor() {
        this.C1 = databaseService.define('c1', {
            f1: sequelize.STRING,
            f2: sequelize.STRING
        });
    }
}

export default new ModelsFactory();

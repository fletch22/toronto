// @flow
import sequelize from 'sequelize';
import _ from 'lodash';
import dataUniverseModelUtils from '../../../common/domain/component/dataUniverseModelUtils';
import stringUtils from '../../../common/util/stringUtils';
import { statePackageTest } from '../../spec/statePackageTest';
import dataStoreModelUtils from '../../../common/domain/component/dataStoreModelUtils';
import dataModelModelUtils from '../../../common/domain/component/dataModelModelUtils';


type SqlDataModel = {
  tableName: String,
  definedModel: Object,
  userData: Array<Object>
};

export type SqlDatabaseModel = {
  databaseName: string,
  dbModels: Array<SqlDataModel>
}

class StateToSqlTransformer {
  getDefinedModel(dataModel: Object) {
    const definedModel = {};
    dataModel.children.forEach((field) => {
      definedModel[field.label] = {
        type: sequelize.STRING,
        sequelizeType: 'sequelize.STRING'
      };
    });

    return definedModel;
  }

  transformRecordArray(recordArray: Array<string>, dataFieldArray: Array<Object>) {
    const instance = {};

    c.lo(recordArray, 'recordArray: ');

    recordArray.forEach((fieldValue, ndxRecord) => {
      if (ndxRecord === 0) {
        instance.id = fieldValue;
      } else {
        instance[dataFieldArray[ndxRecord - 1].label] = fieldValue;
      }
    });
    return instance;
  }

  transformUsersDataArray(dataFieldArray: Array<Object>, userDataArray: Array<Array<string>>): Array<Object> {
    const instanceArray = [];
    userDataArray.forEach((recordArray) => {
      const instance = this.transformRecordArray(recordArray, dataFieldArray);
      instanceArray.push(instance);
    });

    return instanceArray;
  }

  tranformDataModelToDefinedModel(dataModel: Object): SqlDataModel {
    const userDataArray = _.cloneDeep(dataModel.userData);

    return {
      tableName: dataModel.label,
      definedModel: this.getDefinedModel(dataModel),
      userData: this.transformUsersDataArray(dataModel.children, userDataArray)
    };
  }

  tranformDataModelsToDefinedModels(dataModels: Array<Object>): Array<SqlDataModel> {
    return dataModels.map((dataModel) => this.tranformDataModelToDefinedModel(dataModel));
  }

  findDataModels(state: Object) {
    const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
    const dataStore = dataStoreModelUtils.getDefaultDatastore(dataUniverse);
    return dataModelModelUtils.getDataModels(dataStore);
  }

  transform(statePackage: Object): SqlDatabaseModel {
    const dataModels = this.findDataModels(statePackage.state);
    const dbModels = this.tranformDataModelsToDefinedModels(dataModels);
    const databaseName: string = `f22_${stringUtils.replaceAll(statePackageTest.CLIENT_ID_dk89h22njkfdu90jo21kl231kl2199, '-', '_')}`;

    return {
      databaseName,
      dbModels
    };
  }
}

export default new StateToSqlTransformer();

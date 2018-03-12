import ComponentTypes from '../../../common/domain/component/ComponentTypes';
import _ from 'lodash';
import dataUniverseModelUtils from './dataUniverseModelUtils';
import dataModelModelUtils from './dataModelModelUtils';

export const DatastoreModelConstants = {
  DEFAULT_DATASTORE_LABEL: 'default'
};

class DataStoreModelUtils {
  getDataStores(dataUniverse) {
    return _.filter(dataUniverse.children, (child) => child.typeLabel === ComponentTypes.Datastore);
  }

  findById(dataStores, idValue) {
    return _.find(dataStores, { id: idValue });
  }

  getDefaultDataStore(dataUniverse) {
    return this.getDataStores(dataUniverse).find((dataStore) => {
      return dataStore.label === DatastoreModelConstants.DEFAULT_DATASTORE_LABEL;
    });
  }

  getDefaultDataStoreByState(state) {
    const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
    return this.getDefaultDataStore(dataUniverse);
  }

  getDataModelModelUtils() {
    return dataModelModelUtils;
  }
}

export default new DataStoreModelUtils();

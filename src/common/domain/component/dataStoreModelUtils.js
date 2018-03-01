import ComponentTypes from '../../../common/domain/component/ComponentTypes';
import _ from 'lodash';

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

  getDefaultDatastore(dataUniverse) {
    return this.getDataStores(dataUniverse).find((dataStore) => {
      return dataStore.label === DatastoreModelConstants.DEFAULT_DATASTORE_LABEL;
    });
  }
}

export default new DataStoreModelUtils();

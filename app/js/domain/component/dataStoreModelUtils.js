import ComponentTypes from '../../domain/component/ComponentTypes';
import _ from 'lodash';


class DataStoreModelUtils {
  getDataStores(dataUniverse) {
    return _.filter(dataUniverse.children, (child) => child.typeLabel === ComponentTypes.Datastore);
  }

  findById(dataStores, id) {
    return _.find(dataStores, { id });
  }
}

export default new DataStoreModelUtils();

import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import _ from 'lodash';


class DataStoreModelUtils {
  getDataStores(dataUniverse) {
    return _.filter(dataUniverse.children, (child) => child.typeLabel === ComponentTypes.Datastore);
  }

  findById(dataStores, idValue) {
    return _.find(dataStores, { id: idValue });
  }
}

export default new DataStoreModelUtils();

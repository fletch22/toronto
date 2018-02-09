import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import _ from 'lodash';


class DataModelModelUtils {
  getDataModels(dataStore) {
    return _.filter(dataStore.children, (child) => child.typeLabel === ComponentTypes.DataModel);
  }

  findById(dataModels, id) {
    return _.find(dataModels, { id });
  }
}

export default new DataModelModelUtils();

import ComponentTypes from './ComponentTypes';
import _ from 'lodash';
import dataStoreModelUtils from './dataStoreModelUtils';

export const DataUniverseModelConstants = {
  DEFAULT_DATAUNIVERSE_LABEL: 'default'
};


class DataUniverseModelUtils {

  getDataUniverse(state) {
    return _.find(state.model.appContainer.children, (child) => {
      return child.typeLabel === ComponentTypes.DataUniverse && child.label === DataUniverseModelConstants.DEFAULT_DATAUNIVERSE_LABEL;
    });
  }

  getDataStoreModelUtils() {
    return dataStoreModelUtils;
  }
}

export default new DataUniverseModelUtils();

import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import _ from 'lodash';

export const DataUniverseModelConstants = {
  DEFAULT_DATAUNIVERSE_LABEL: 'default'
};


class DataUniverseModelUtils {

  getDataUniverse(state) {
    return _.find(state.model.appContainer.children, (child) => {
      return child.typeLabel === ComponentTypes.DataUniverse && child.label === DataUniverseModelConstants.DEFAULT_DATAUNIVERSE_LABEL;
    });
  }
}

export default new DataUniverseModelUtils();

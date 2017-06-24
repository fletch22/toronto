import ComponentTypes from '../../domain/component/ComponentTypes';
import _ from 'lodash';


class DataFieldModelUtils {
  getDataFields(dataModel) {
    return _.filter(dataModel.children, (child) => child.typeLabel === ComponentTypes.DataField);
  }

  findById(dataField, id) {
    return _.find(dataField, { id });
  }
}

export default new DataFieldModelUtils();

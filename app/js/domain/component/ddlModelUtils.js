import ComponentTypes from '../../domain/component/ComponentTypes';
import stateUtil from '../../util/stateUtil';

class DdlModelUtils {

  constructor() {
    this.stateUtil = stateUtil;
  }

  getUniqueDdlName(state) {
    return this.stateUtil.getUniquePropertyValueAmongTypes(state, ComponentTypes.DropDownListbox, 'elementId', 'Select');
  }
}

export default new DdlModelUtils();

import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';

class DnTransferTargetFieldModelFactory extends ModelFactory {
  createInstance(state, parentId, refId) {
    const id = this.getNextId(state);
    return {
      id,
      refId,
      parentId,
      typeLabel: ComponentTypes.DnTransferTargetField,
      children: []
    };
  }
}

export default new DnTransferTargetFieldModelFactory();


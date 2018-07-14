import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';

class DnTransferTargetFieldModelFactory extends ModelFactory {
  createInstance(state, parentId, ref) {
    const id = this.getNextId(state);
    return {
      id,
      ...ref,
      parentId,
      typeLabel: ComponentTypes.DnTransferTargetField,
      children: []
    };
  }
}

export default new DnTransferTargetFieldModelFactory();


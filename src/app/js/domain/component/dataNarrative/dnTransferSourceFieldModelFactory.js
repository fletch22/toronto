import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';

class DnTransferSourceFieldModelFactory extends ModelFactory {
  createInstance(state, parentId, refId) {
    const id = this.getNextId(state);
    return {
      id,
      refId,
      parentId,
      typeLabel: ComponentTypes.DnTransferSourceField,
      children: []
    };
  }
}

export default new DnTransferSourceFieldModelFactory();


import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';

class DnTransferFieldMapperModelFactory extends ModelFactory {
  createInstance(state, parentId) {
    const id = this.getNextId(state);
    return {
      id,
      parentId,
      typeLabel: ComponentTypes.DnTransferFieldMapper,
      children: []
    };
  }
}

export default new DnTransferFieldMapperModelFactory();


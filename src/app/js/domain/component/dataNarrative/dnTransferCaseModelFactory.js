import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';

class DnTransferCaseModelFactory extends ModelFactory {
  createInstance(state, parentId) {
    const id = this.getNextId(state);
    return {
      id,
      parentId,
      typeLabel: ComponentTypes.DnTransferCase,
      children: []
    };
  }
}

export default new DnTransferCaseModelFactory();


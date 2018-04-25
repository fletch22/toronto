import ModelFactory from '../ModelFactory';
import f22Uuid from '../../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';

class DnTransferCaseModelFactory extends ModelFactory {
  createInstance(state, parentId, sourceAndTargetModels) {
    const id = this.getNextId(state);
    return {
      id,
      parentId,
      typeLabel: ComponentTypes.DnTransferCase,
      sourceAndTargetModels,
      children: []
    };
  }
}

export default new DnTransferCaseModelFactory();


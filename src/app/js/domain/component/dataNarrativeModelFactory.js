import ModelFactory from './ModelFactory';
import f22Uuid from '../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from './svgModelFactoryHelper';

class DataNarrativeModelFactory extends ModelFactory {
  createInstance(parentId) {
    return svgModelFactoryHelper.mergeSvgAttributes({
      id: f22Uuid.generate(),
      parentId,
      typeLabel: ComponentTypes.DataNarrative,
      children: []
    });
  }
}

export default new DataNarrativeModelFactory();

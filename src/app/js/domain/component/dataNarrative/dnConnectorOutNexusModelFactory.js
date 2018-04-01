import ModelFactory from '../ModelFactory';
import f22Uuid from '../../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';

class DnConnectorOutNexusModelFactory extends ModelFactory {
  createInstance(parentId, offsetX, offsetY) {
    return svgModelFactoryHelper.mergeSvgAttributes({
      id: f22Uuid.generate(),
      parentId,
      offsetX,
      offsetY,
      viewCoordinates: { x: offsetX, y: offsetY },
      typeLabel: ComponentTypes.DnConnectorOutNexus,
      children: []
    });
  }
}

export default new DnConnectorOutNexusModelFactory();


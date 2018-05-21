import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';

class DnConnectorOutNexusModelFactory extends ModelFactory {
  createInstance(state, parentId, offsetX, offsetY) {
    const id = this.getNextId(state);
    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      offsetX,
      offsetY,
      viewCoordinates: { x: offsetX, y: offsetY },
      typeLabel: ComponentTypes.DnConnectorOutNexus,
      children: [],
      draggingConnector: {
        position: {
          x: 0,
          y: 0
        },
        visible: false
      }
    });
  }
}

export default new DnConnectorOutNexusModelFactory();


import ModelFactory from '../ModelFactory';
import f22Uuid from '../../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';

class DnConnectorInNexusModelFactory extends ModelFactory {
  createInstance(state, parentId, offsetX, offsetY, sourceFieldIds) {
    const id = this.getNextId(state);
    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      offsetX,
      offsetY,
      viewCoordinates: { x: offsetX, y: offsetY },
      typeLabel: ComponentTypes.DnConnectorInNexus,
      sourceFieldIds,
      children: []
    });
  }
}

export default new DnConnectorInNexusModelFactory();


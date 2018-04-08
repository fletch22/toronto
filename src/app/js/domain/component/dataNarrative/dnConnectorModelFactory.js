import ModelFactory from '../ModelFactory';
import f22Uuid from '../../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';

class DnConnectorModelFactory extends ModelFactory {
  createInstance(id, parentId, connectorInNexusId) {
    return {
      id,
      parentId,
      typeLabel: ComponentTypes.DnConnector,
      connectorInNexusId,
      children: []
    };
  }
}

export default new DnConnectorModelFactory();


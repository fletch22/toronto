import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';
import dnConnectorInNexusModelFactory from './dnConnectorInNexusModelFactory';
import dnConnectorOutNexusModelFactory from './dnConnectorOutNexusModelFactory';

class DnWebServerModelFactory extends ModelFactory {
  createInstance(state, parentId) {
    const id = this.getNextId(state);

    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      typeLabel: ComponentTypes.DnWebServer,
      children: [this.createConnectorIn(state, id, 16, 88), this.createConnectorOut(state, id, 132, 5)]
    });
  }

  createConnectorIn(state, parentId, offsetX, offsetY) {
    return dnConnectorInNexusModelFactory.createInstance(state, parentId, offsetX, offsetY);
  }

  createConnectorOut(state, parentId, offsetX, offsetY) {
    return dnConnectorOutNexusModelFactory.createInstance(state, parentId, offsetX, offsetY);
  }
}

export default new DnWebServerModelFactory();


import ModelFactory from '../ModelFactory';
import f22Uuid from '../../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';
import dnConnectorInNexusModelFactory from './dnConnectorInNexusModelFactory';
import dnConnectorOutNexusModelFactory from './dnConnectorOutNexusModelFactory';

class DnWebServerModelFactory extends ModelFactory {
  createInstance(parentId, dataStoreId) {
    const id = f22Uuid.generate();

    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      dataStoreId,
      typeLabel: ComponentTypes.DnWebServer,
      children: [this.createConnectorIn(id, 16, 88), this.createConnectorOut(id, 132, 5)]
    });
  }

  createConnectorIn(parentId, offsetX, offsetY) {
    return dnConnectorInNexusModelFactory.createInstance(parentId, offsetX, offsetY);
  }

  createConnectorOut(parentId, offsetX, offsetY) {
    return dnConnectorOutNexusModelFactory.createInstance(parentId, offsetX, offsetY);
  }
}

export default new DnWebServerModelFactory();


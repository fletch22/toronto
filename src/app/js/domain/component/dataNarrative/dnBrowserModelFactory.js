import ModelFactory from '../ModelFactory';
import f22Uuid from '../../../../../common/util/f22Uuid';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';
import dnConnectorOutNexusModelFactory from './dnConnectorOutNexusModelFactory';

class DnBrowserModelFactory extends ModelFactory {
  createInstance(parentId, dataStoreId) {
    const id = f22Uuid.generate();
    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      dataStoreId,
      typeLabel: ComponentTypes.DnBrowser,
      children: [this.createConnectorIngress(id, 100, 39)]
    });
  }

  createConnectorIngress(parentId, offsetX, offsetY) {
    return dnConnectorOutNexusModelFactory.createInstance(parentId, offsetX, offsetY);
  }
}

export default new DnBrowserModelFactory();


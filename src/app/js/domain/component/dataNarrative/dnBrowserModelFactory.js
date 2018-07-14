import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';
import dnConnectorOutNexusModelFactory from './dnConnectorOutNexusModelFactory';

class DnBrowserModelFactory extends ModelFactory {
  createInstance(state, parentId) {
    const id = this.getNextId(state);
    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      typeLabel: ComponentTypes.DnBrowser,
      children: [this.createConnectorOut(state, id, 100, 39)]
    });
  }

  createConnectorOut(state, parentId, offsetX, offsetY) {
    return dnConnectorOutNexusModelFactory.createInstance(state, parentId, offsetX, offsetY, 0);
  }
}

export default new DnBrowserModelFactory();


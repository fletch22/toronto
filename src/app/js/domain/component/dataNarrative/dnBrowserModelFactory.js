import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';
import dnConnectorOutNexusModelFactory from './dnConnectorOutNexusModelFactory';

class DnBrowserModelFactory extends ModelFactory {
  createInstance(state, parentId, sourceFieldIds) {
    const id = this.getNextId(state);
    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      typeLabel: ComponentTypes.DnBrowser,
      children: [this.createConnectorIngress(state, id, 100, 39, sourceFieldIds)]
    });
  }

  createConnectorIngress(state, parentId, offsetX, offsetY, sourceFieldIds) {
    return dnConnectorOutNexusModelFactory.createInstance(state, parentId, offsetX, offsetY, sourceFieldIds);
  }
}

export default new DnBrowserModelFactory();


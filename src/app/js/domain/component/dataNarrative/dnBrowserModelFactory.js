import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';
import dnConnectorOutNexusModelFactory from './dnConnectorOutNexusModelFactory';
import stateTraversal from 'common/state/stateTraversal';

class DnBrowserModelFactory extends ModelFactory {
  createInstance(state, parentId, webPageModelId) {
    const id = this.getNextId(state);
    const ref = stateTraversal.createReference(webPageModelId);

    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      dataSource: ref,
      typeLabel: ComponentTypes.DnBrowser,
      children: [this.createConnectorOut(state, id, 100, 39)]
    });
  }

  createConnectorOut(state, parentId, offsetX, offsetY) {
    return dnConnectorOutNexusModelFactory.createInstance(state, parentId, offsetX, offsetY, 0);
  }
}

export default new DnBrowserModelFactory();


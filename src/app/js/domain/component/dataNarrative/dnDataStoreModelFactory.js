import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';
import dnConnectorInNexusModelFactory from './dnConnectorInNexusModelFactory';
import stateTraversal from 'common/state/stateTraversal';

class DnDataStoreModelFactory extends ModelFactory {
  createInstance(state, parentId, dataStoreId) {
    const id = this.getNextId(state);

    const ref = stateTraversal.createReference(dataStoreId);

    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      dataSource: ref,
      typeLabel: ComponentTypes.DnDataStore,
      children: [this.createConnectorIngress(state, id, 5, 44)]
    });
  }

  createConnectorIngress(state, parentId, offsetX, offsetY) {
    return dnConnectorInNexusModelFactory.createInstance(state, parentId, offsetX, offsetY);
  }
}

export default new DnDataStoreModelFactory();


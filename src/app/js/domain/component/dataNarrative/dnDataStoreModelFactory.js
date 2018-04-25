import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';
import dnConnectorInNexusModelFactory from './dnConnectorInNexusModelFactory';

class DnDataStoreModelFactory extends ModelFactory {
  createInstance(state, parentId, dataStoreId) {
    const id = this.getNextId(state);

    return svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      dataStoreId,
      typeLabel: ComponentTypes.DnDataStore,
      children: [this.createConnectorIngress(state, id, 5, 44)]
    });
  }

  createConnectorIngress(state, parentId, offsetX, offsetY) {
    return dnConnectorInNexusModelFactory.createInstance(state, parentId, offsetX, offsetY);
  }
}

export default new DnDataStoreModelFactory();


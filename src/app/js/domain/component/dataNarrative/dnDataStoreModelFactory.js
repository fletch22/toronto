import ModelFactory from '../ModelFactory';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import svgModelFactoryHelper from '../svgModelFactoryHelper';
import dnConnectorInNexusModelFactory from './dnConnectorInNexusModelFactory';
import referenceUtils from '../../../util/referenceUtils';

class DnDataStoreModelFactory extends ModelFactory {
  createInstance(state, parentId, dataStore) {
    const id = this.getNextId(state);

    const dnDataStoreModel = svgModelFactoryHelper.mergeSvgAttributes({
      id,
      parentId,
      typeLabel: ComponentTypes.DnDataStore,
      children: [this.createConnectorIngress(state, id, 5, 44)]
    });

    referenceUtils.createReference(state, dnDataStoreModel, 'dataSource', dataStore.id, `depends on ${dataStore.typeLabel} '${dataStore.id}'`);

    return dnDataStoreModel;
  }

  createConnectorIngress(state, parentId, offsetX, offsetY) {
    return dnConnectorInNexusModelFactory.createInstance(state, parentId, offsetX, offsetY);
  }
}

export default new DnDataStoreModelFactory();


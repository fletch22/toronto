import ModelFactory from './ModelFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';

class DdlModelFactory extends ModelFactory {

  createInstanceFromModel(model) {
    const id = this.ensureId(model);

    return {
      parentId: model.parentId,
      id,
      elementId: model.elementId || '-1',
      collectionCallName: model.collectionCallName,
      dataStoreId: model.dataStoreId || '-1',
      dataModelId: model.dataModelId || '-1',
      dataValueId: model.dataValueId || '-1',
      dataTextId: model.dataTextId || '-1',
      typeLabel: ComponentTypes.DropDownListbox,
      style: model.style || null,
      ordinal: model.ordinal
    };
  }

  createInstance(parentId, elementId, dataStoreId, dataModelId, dataValueId, dataTextId, ordinal) {
    return this.createInstanceFromModel({ parentId, elementId, dataStoreId, dataModelId, dataValueId, dataTextId, ordinal });
  }
}

export default new DdlModelFactory();


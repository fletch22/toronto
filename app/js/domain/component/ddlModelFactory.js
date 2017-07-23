import ModelFactory from './ModelFactory';
import f22Uuid from '../../util/f22Uuid';
import ComponentTypes from '../../domain/component/ComponentTypes';

class DdlModelFactory extends ModelFactory {

  createInstanceFromModel(model) {
    const id = f22Uuid.generate();

    let dataStoreIdNumber = null;
    if (model.dataStoreId) {
      dataStoreIdNumber = parseInt(model.dataStoreId, 10);
    }

    return {
      parentId: model.parentId,
      id,
      elementId: model.elementId,
      dataStoreId: dataStoreIdNumber,
      dataModelId: model.dataModelId,
      dataValueId: model.dataValueId,
      dataTextId: model.dataTextId,
      typeLabel: ComponentTypes.DropDownListbox,
      style: model.style || null
    };
  }

  createInstance(parentId, elementId, dataStoreId, dataModelId, dataValueId, dataTextId) {
    return this.createInstanceFromModel({ parentId, elementId, dataStoreId, dataModelId, dataValueId, dataTextId });
  }
}

export default new DdlModelFactory();


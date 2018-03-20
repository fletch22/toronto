import ModelFactory from './ModelFactory';
import dataNarrativeModelFactory from '../../domain/component/dataNarrativeModelFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import dataUniverseModelUtils from '../../../../common/domain/component/dataUniverseModelUtils';
import dnDataStoreModelFactory from '../../domain/component/dataNarrative/dnDataStoreModelFactory';

class ButtonSubmitModelFactory extends ModelFactory {

  createInstanceFromModel(model) {
    const id = this.ensureId(model);

    return {
      parentId: model.parentId,
      id,
      typeLabel: ComponentTypes.ButtonSubmit,
      elementId: model.elementId,
      label: model.label,
      style: model.style || null,
      ordinal: model.ordinal,
      children: []
    };
  }

  createInstance(state, parentId, elementId, label, ordinal) {
    const buttonSubmitInstance = this.createInstanceFromModel({ parentId, elementId, label, ordinal });

    const dataNarrative = dataNarrativeModelFactory.createInstance(buttonSubmitInstance.id);

    const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
    const defaultDataStore = dataUniverseModelUtils.getDataStoreModelUtils().getDefaultDataStore(dataUniverse);
    const dnDataStoreModel = dnDataStoreModelFactory.createInstance(parentId, defaultDataStore.id);
    const dnDataStoreModelExtra = dnDataStoreModelFactory.createInstance(parentId, defaultDataStore.id);
    dataNarrative.children = [dnDataStoreModel, dnDataStoreModelExtra];

    buttonSubmitInstance.children = [dataNarrative];

    return buttonSubmitInstance;
  }
}

export default new ButtonSubmitModelFactory();

import ModelFactory from './ModelFactory';
import dataNarrativeModelFactory from '../../domain/component/dataNarrativeModelFactory';
import ComponentTypes from '../../../../common/domain/component/ComponentTypes';
import dataUniverseModelUtils from '../../../../common/domain/component/dataUniverseModelUtils';
import dnDataStoreModelFactory from '../../domain/component/dataNarrative/dnDataStoreModelFactory';
import dnBrowserModelFactory from '../../domain/component/dataNarrative/dnBrowserModelFactory';
import dnWebServerModelFactory from '../../domain/component/dataNarrative/dnWebServerModelFactory';
import graphTraversal from '../../../../common/state/graphTraversal';
import stateTraversal from '../../../../common/state/stateTraversal';

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
    const dnDataStoreModel = dnDataStoreModelFactory.createInstance(state, dataNarrative.id, defaultDataStore.id);

    const parentNode = graphTraversal.find(state.model, parentId);
    const sourceFieldIds = stateTraversal.getWebPageFormFields(state.model, parentNode);

    const dnBrowserModel = dnBrowserModelFactory.createInstance(state, dataNarrative.id, sourceFieldIds);
    const dnWebServerModel = dnWebServerModelFactory.createInstance(state, dataNarrative.id);

    dataNarrative.children = [dnDataStoreModel, dnWebServerModel, dnBrowserModel];

    buttonSubmitInstance.children = [dataNarrative];

    return buttonSubmitInstance;
  }
}

export default new ButtonSubmitModelFactory();

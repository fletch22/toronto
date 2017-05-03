import f22Uuid from '../../../../../util/f22Uuid';
import PseudoModalTypes from '../../../../../component/modals/PseudoModalTypes';
import gridViewModelFactory from '../../../../../domain/collection/gridViewModelFactory';

class ConfigureDdlWizardViewFactory {
  createInstance(ddlModel) {
    return {
      id: f22Uuid.generate(),
      type: PseudoModalTypes.WizardTypes.ConfigureDdl,
      model: ddlModel,
      activeIndex: 0,
      selectedCollectionId: null,
      selectedValueFieldId: null,
      selectedTextFieldId: null,
      slides: {
        selectCollection: {
          id: f22Uuid.generate(),
          newItemNameInput: {
            id: f22Uuid.generate(),
            value: null,
            visible: false
          },
          buttonNextDisabled: true
        },
        selectContainerFields: {
          id: f22Uuid.generate(),
          newItemNameInput: {
            id: f22Uuid.generate(),
            value: null,
            visible: false
          },
          buttonNextDisabled: true,
          selectedFieldId: null
        },
        createCollection: {
          id: f22Uuid.generate(),
          buttonNextDisabled: true,
          gridView: gridViewModelFactory.createInstance()
        }
      }
    };
  }
}

export default new ConfigureDdlWizardViewFactory();


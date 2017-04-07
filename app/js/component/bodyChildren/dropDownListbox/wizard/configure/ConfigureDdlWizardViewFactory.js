import f22Uuid from '../../../../../util/f22Uuid';
import PseudoModalTypes from '../../../../../component/modals/PseudoModalTypes';

class ConfigureDdlWizardViewFactory {
  createInstance(ddlModel) {
    return {
      id: f22Uuid.generate(),
      type: PseudoModalTypes.WizardTypes.ConfigureDdl,
      model: ddlModel,
      activeIndex: 0,
      selectedCollectionId: null,
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
          buttonNextDisabled: false,
          selectedValueFieldId: null,
          selectedTextFieldId: null
        }
      }
    };
  }
}

export default new ConfigureDdlWizardViewFactory();


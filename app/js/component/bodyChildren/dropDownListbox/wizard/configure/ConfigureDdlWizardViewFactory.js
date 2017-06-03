import f22Uuid from '../../../../../util/f22Uuid';
import PseudoModalTypes from '../../../../../component/modals/PseudoModalTypes';
import gridViewModelFactory from '../../../../../domain/collection/gridViewModelFactory';

class ConfigureDdlWizardViewFactory {

  constructor() {
    this.Constants = {
      DataSourceType: {
        Collection: 'Collection',
        Query: 'Query',
        External: 'External'
      }
    };
  }

  createInstance(ddlModel) {
    return {
      id: f22Uuid.generate(),
      type: PseudoModalTypes.WizardTypes.ConfigureDdl,
      model: ddlModel,
      activeIndex: 0,
      dataSourceType: null,
      selectedDataModelId: null,
      selectedValueFieldId: null,
      selectedTextFieldId: null,
      slides: {
        selectDataSourceType: {
          id: f22Uuid.generate(),
          buttonNextDisabled: true
        },
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


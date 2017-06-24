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

  createInstance(parentComponentViewId, ddlModel) {
    return {
      id: f22Uuid.generate(),
      parentComponentViewId,
      type: PseudoModalTypes.WizardTypes.ConfigureDdl,
      model: ddlModel,
      activeIndex: 0,
      dataSourceName: null,
      dataSourceType: null,
      dataStoreId: null,
      dataModelId: null,
      dataValueId: null,
      dataTextId: null,
      selectedDataModelId: null,
      selectedDataModelLabel: null,
      selectedValueFieldId: null,
      selectedValueFieldName: null,
      selectedTextFieldId: null,
      selectedTextFieldName: null,
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
        },
        saveDdlInfo: {
          id: f22Uuid.generate()
        }
      }
    };
  }
}

export default new ConfigureDdlWizardViewFactory();


import f22Uuid from '../../../../../util/f22Uuid';
import PseudoModalTypes from '../../../../../component/modals/PseudoModalTypes';
import gridViewModelFactory from '../../../../../domain/collection/gridViewModelFactory';
import dataUniverseModelUtils from '../../../../../domain/component/dataUniverseModelUtils';
import dataStoreModelUtils from '../../../../../domain/component/dataStoreModelUtils';
import dataModelModelUtils from '../../../../../domain/component/dataModelModelUtils';
import dataFieldModelUtils from '../../../../../domain/component/dataFieldModelUtils';

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

  createInstance(state, parentComponentViewId, ddlModel) {
    const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
    const dataStores = dataStoreModelUtils.getDataStores(dataUniverse);

    const selectedDataStore = dataStoreModelUtils.findById(dataStores, ddlModel.dataStoreId);

    let dataStoreLabel = null;
    let dataModelId = null;
    let dataModelLabel = null;
    let dataValueId = null;
    let dataValueLabel = null;
    let dataTextId = null;
    let dataTextLabel = null;
    if (selectedDataStore) {
      dataStoreLabel = selectedDataStore.label;

      dataModelId = null;
      const dataModels = dataModelModelUtils.getDataModels(selectedDataStore);
      const dataModel = dataModelModelUtils.findById(dataModels, ddlModel.dataModelId);
      if (dataModel) {
        dataModelId = dataModel.id;
        dataModelLabel = dataModel.label;

        const dataFields = dataFieldModelUtils.getDataFields(dataModel);
        const dataValueField = dataFieldModelUtils.findById(dataFields, ddlModel.dataValueId);
        if (dataValueField) {
          dataValueId = dataValueField.id;
          dataValueLabel = dataValueField.label;
        }

        const dataTextField = dataFieldModelUtils.findById(dataFields, ddlModel.dataTextId);
        if (dataTextField) {
          dataTextId = dataTextField.id;
          dataTextLabel = dataTextField.label;
        }
      }
    }

    return {
      id: f22Uuid.generate(),
      parentComponentViewId,
      type: PseudoModalTypes.WizardTypes.ConfigureDdl,
      model: ddlModel,
      activeIndex: 0,
      dataSourceType: null,
      dataStoreId: ddlModel.dataStoreId,
      dataStoreLabel,
      dataModelId,
      dataModelLabel,
      dataValueId,
      dataValueLabel,
      dataTextId,
      dataTextLabel,
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


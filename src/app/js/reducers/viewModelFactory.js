import _ from 'lodash';
import ComponentTypes from '../../../common/domain/component/ComponentTypes';
import PseudoModalTypes from '../component/modals/PseudoModalTypes';
import graphTraversal from '../../../common/state/graphTraversal';
import viewFactory from '../domain/component/view/viewFactory';
import configureDdlWizardViewFactory from '../component/bodyChildren/dropDownListbox/wizard/configure/ConfigureDdlWizardViewFactory';
import { DatastoreModelConstants } from '../../../common/domain/component/dataStoreModelUtils';
import dataUniverseUtils from '../../../common/domain/component/dataUniverseModelUtils';
import f22Uuid from 'common/util/f22Uuid';

export const ViewModelType = {
  DnTransferCaseEditor: 'DnTransferCaseEditor',
  DnTransferTargetField: 'DnTransferTargetField',
  DnTransferSourceField: 'DnTransferSourceField'
};

class ViewModelFactory {

  constructor() {
    this.WEB_PAGE_ROOT = 'WEB_PAGE_ROOT';
  }

  getPseudoModalDataForExistingVm(type, state, viewId) {
    // Note: This should be changed to just 'viewName'
    let viewName;
    let data;
    let pseudoModalType;

    const outerViewModel = graphTraversal.find(state, viewId);

    const modelNodeId = outerViewModel.viewModel.id;

    const model = _.cloneDeep(graphTraversal.find(state.model, modelNodeId));

    let title = '';
    let className = '';
    switch (type) {
      case PseudoModalTypes.WizardTypes.ConfigureDdl: {
        // TODO: Needs to pull out unneeded data here after viewModel pattern is implemented.
        data = configureDdlWizardViewFactory.createInstance(state, viewId, model);

        const dataUniverse = dataUniverseUtils.getDataUniverse(state);
        const dataStores = this.getApplicationDatastores(dataUniverse);

        // TODO: 07-09-2017: This is not right. Should not choose the default datastore. Should let the already selected datastore dictate.
        let defaultDatastore = _.find(dataStores, (datastore) => (datastore.label === DatastoreModelConstants.DEFAULT_DATASTORE_LABEL));

        defaultDatastore = _.cloneDeep(defaultDatastore);

        // TODO: 07-09-2017: This is not right. Should not use datastore for viewModel. Should use special configDdlViewModel.
        const viewModel = this.generateViewModel(data.id, defaultDatastore);
        Object.assign(data, { viewModel });

        viewName = PseudoModalTypes.WizardTypes.ConfigureDdl;
        pseudoModalType = PseudoModalTypes.WizardTypes.ConfigureDdl;
        title = 'Configure Select';
        className = 'pseudo-modal-edit-configureddl';
        break;
      }
      default: {
        throw new Error(`Action not yet configured to handle ${type}.`);
      }
    }

    return {
      viewName,
      data,
      pseudoModalType,
      title,
      className
    };
  }

  getPseudoModalDataFromViewModel(type, viewModel) {
    // Note: This should be changed to just 'viewName'
    let viewName;
    let data;
    let pseudoModalType;

    let title = '';
    let className = '';
    switch (type) {
      case PseudoModalTypes.DataNarrativeEditor: {
        data = viewModel;

        viewName = PseudoModalTypes.DataNarrativeEditor;
        pseudoModalType = PseudoModalTypes.DataNarrativeEditor;
        title = 'Edit Data Narrative';
        className = 'pseudo-modal-dn-master-edit';
        break;
      }
      case PseudoModalTypes.DataNarrativeTransferCaseEditor: {
        data = viewModel;

        viewName = PseudoModalTypes.DataNarrativeTransferCaseEditor;
        pseudoModalType = PseudoModalTypes.DataNarrativeTransferCaseEditor;
        title = 'Edit Data Narrative Transfer Case';
        className = 'pseudo-modal-dn-transfser-case-edit';
        break;
      }
      default: {
        throw new Error(`Action not yet configured to handle ${type}.`);
      }
    }

    return {
      viewName,
      data,
      pseudoModalType,
      title,
      className
    };
  }

  getApplicationDatastores(dataUniverse) {
    return _.filter(dataUniverse.children, (child) => {
      return child.typeLabel === ComponentTypes.Datastore;
    });
  }

  generateViewModel(viewModelParentId, model) {
    let view;
    switch (model.typeLabel) {
      case ComponentTypes.WebPage: {
        view = viewFactory.createPageView(model);
        break;
      }
      case ComponentTypes.Div: {
        view = viewFactory.createDivView();
        break;
      }
      case ComponentTypes.DropDownListbox: {
        view = viewFactory.createDdlView(model);
        break;
      }
      case ComponentTypes.Datastore: {
        view = viewFactory.createDatastoreView();
        break;
      }
      case ComponentTypes.DataModel: {
        view = viewFactory.createDataModelView();
        break;
      }
      case ComponentTypes.DataField: {
        view = viewFactory.createDataFieldView();
        break;
      }
      case ComponentTypes.ButtonSubmit: {
        view = viewFactory.createButtonSubmitView(model);
        break;
      }
      case ComponentTypes.DataNarrative: {
        view = viewFactory.createDataNarrativeView(model);
        break;
      }
      case ComponentTypes.DnBrowser: {
        view = viewFactory.createDnBrowserView();
        break;
      }
      case ComponentTypes.DnConnector: {
        view = viewFactory.createDnConnectorView();
        break;
      }
      case ComponentTypes.DnConnectorInNexus: {
        view = viewFactory.createDnConnectorInNexusView();
        break;
      }
      case ComponentTypes.DnConnectorOutNexus: {
        view = viewFactory.createDnConnectorOutNexusView();
        break;
      }
      case ComponentTypes.DnTransferCase: {
        view = viewFactory.createDnTransferCaseView();
        break;
      }
      case ComponentTypes.DnWebServer: {
        view = viewFactory.createDnWebServerView();
        break;
      }
      case ComponentTypes.Cylinder: {
        view = viewFactory.createCylinderView();
        break;
      }
      case ComponentTypes.DnDataStore: {
        view = viewFactory.createDnDatastoreView(model);
        break;
      }
      default: {
        throw new Error(`Encountered error trying to determine view to create for model typelabel \'${model.typeLabel}\'.`);
      }
    }
    return Object.assign(view, { parentId: viewModelParentId }, { viewModel: this.generateChildrensViewModels(view.id, model) });
  }

  generateChildrensViewModels(viewModelParentId, modelParent) {
    const viewModelParent = _.cloneDeep(modelParent);
    if (viewModelParent.children) {
      viewModelParent.children.forEach((model, index) => {
        viewModelParent.children[index] = this.generateViewModel(viewModelParentId, model);
      });
    }

    return viewModelParent;
  }

  generateViewModelFromViewModelType(viewModelParentId, viewModelType, model) {
    const view = {
      id: f22Uuid.generate(),
      parentId: viewModelParentId
    };

    const embeddedModel = _.cloneDeep(model);

    switch (viewModelType) {
      case ViewModelType.DnTransferCaseEditor: {
        embeddedModel.children = model.children.map((child) => {
          // NOTE: 2018-06-16: Special branching here if 'one to one' won't work.
          const childViewModelType = self.getChildViewTypeOneToOne(child.typeLabel);
          return this.generateViewModelFromViewModelType(view.id, childViewModelType, child);
        });
        break;
      }
      case ViewModelType.DnTransferSourceField || ViewModelType.DnTransferTargetField: {
        embeddedModel.children = model.children.map((child) => {
          const childViewModelType = self.getChildViewTypeOneToOne(child.typeLabel);
          return this.generateViewModelFromViewModelType(view.id, childViewModelType, child);
        });
        break;
      }
      default: {
        throw new Error(`Encountered error trying to determine view to create for model typelabel \'${model.typeLabel}\'.`);
      }
    }

    return { ...view, viewModel: embeddedModel };
  }

  getChildViewTypeOneToOne(typeLabel) {
    let childViewModelType;
    switch (typeLabel) {
      case ComponentTypes.DnTransferSourceField: {
        childViewModelType = ViewModelType.DnTransferSourceField;
        break;
      }
      case ComponentTypes.DnTransferTargetField: {
        childViewModelType = ViewModelType.DnTransferSourceField;
        break;
      }
      default: {
        throw new Error(`Encountered error trying to recognize viewModelType '${typeLabel}'.`);
      }
    }
    return childViewModelType;
  }

  extractModelFromViewModel(viewModel) {
    const clone = _.cloneDeep(viewModel.viewModel);
    if (clone.children) {
      clone.children = this.extractChildrenFromViewModel(clone.children);
    }
    return clone;
  }

  extractModelFromModelFromViewModel(viewModel) {
    const clone = _.cloneDeep(viewModel);
    if (clone.children) {
      clone.children = this.extractChildrenFromViewModel(clone.children);
    }
    return clone;
  }

  extractChildrenFromViewModel(viewModelsChildren) {
    const modelChildren = [];
    viewModelsChildren.forEach((item, index) => {
      modelChildren[index] = this.extractModelFromViewModel(item);
    });
    return modelChildren;
  }
}

export default new ViewModelFactory();

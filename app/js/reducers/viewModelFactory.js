import _ from 'lodash';
import ComponentTypes from '../domain/component/ComponentTypes';
import PseudoModalTypes from '../component/modals/PseudoModalTypes';
import EditorNames from '../component/editors/EditorNames';
import graphTraversal from '../state/graphTraversal';
import viewFactory from '../domain/component/view/viewFactory';
import configureDdlWizardViewFactory from '../component/bodyChildren/dropDownListbox/wizard/configure/ConfigureDdlWizardViewFactory';
import { DatastoreModelConstants } from '../domain/component/datastoreModelFactory';
import dataUniverseUtils from '../domain/component/DataUniverseModelUtils';

class ViewModelFactory {

  constructor() {
    this.WEB_PAGE_ROOT = 'WEB_PAGE_ROOT';
  }

  getPseudoModalData(type, state, viewId) {
    // Note: This should be changed to just 'viewName'
    let viewName;
    let data;

    const outerViewModel = graphTraversal.find(state, viewId);

    const modelNodeId = outerViewModel.viewModel.id;

    const model = _.cloneDeep(graphTraversal.find(state.model, modelNodeId));

    switch (type) {
      case PseudoModalTypes.WizardTypes.ConfigureDdl: {
        // TODO: Needs to pull out unneeded data here after viewModel pattern is implemented.
        data = configureDdlWizardViewFactory.createInstance(viewId, model);

        const dataUniverse = dataUniverseUtils.getDataUniverse(state);
        const dataStores = this.getApplicationDatastores(dataUniverse);

        let defaultDatastore = _.find(dataStores, (datastore) => (datastore.label === DatastoreModelConstants.DEFAULT_DATASTORE_LABEL));
        defaultDatastore = _.cloneDeep(defaultDatastore);
        const viewModel = this.generateViewModel(data.id, defaultDatastore);

        Object.assign(data, { viewModel });

        viewName = EditorNames.Wizards.ConfigureDdl;
        break;
      }
      default: {
        throw new Error(`Action not yet configured to handle ${type}.`);
      }
    }

    return {
      viewName,
      data
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
        view = viewFactory.createPageView();
        break;
      }
      case ComponentTypes.Layout: {
        view = viewFactory.createLayoutView();
        break;
      }
      case ComponentTypes.LayoutMinion: {
        view = viewFactory.createLayoutMinionView();
        break;
      }
      case ComponentTypes.Div: {
        view = viewFactory.createDivView();
        break;
      }
      case ComponentTypes.DropDownListbox: {
        view = viewFactory.createDdlView();
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
      default: {
        throw new Error(`Encountered error trying to determine view to create for model typelabel \'${model.typeLabel}\'.`);
      }
    }

    return Object.assign(view, { parentId: viewModelParentId }, { viewModel: this.generateChildrensViewModels(view.id, model) });
  }

  generateChildrensViewModels(viewModelParentId, modelParent) {
    const viewModelParent = Object.assign({}, modelParent);
    if (viewModelParent.children) {
      viewModelParent.children.forEach((model, index) => {
        viewModelParent.children[index] = this.generateViewModel(viewModelParentId, model);
      });
    }

    return viewModelParent;
  }

  extractModelFromViewModel(viewModel) {
    const clone = _.cloneDeep(viewModel.viewModel);
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

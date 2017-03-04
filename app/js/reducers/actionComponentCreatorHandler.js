import _ from 'lodash';
import ComponentTypes from '../domain/component/ComponentTypes';
import PseudoModalTypes from '../component/modals/PseudoModalTypes';
import EditorNames from '../component/editors/EditorNames';
import graphTraversal from '../state/graphTraversal';
import f22Uuid from '../util/f22Uuid';
import viewFactory from '../domain/component/view/viewFactory';
import configureDdlWizardViewFactory from '../component/bodyChildren/dropDownListbox/wizard/configure/ConfigureDdlWizardViewFactory';

class ActionComponentCreatorHandler {

  constructor() {
    this.WEB_PAGE_ROOT = 'WEB_PAGE_ROOT';
  }

  createComponentEditorData(state, action) {
    const type = action.payload.componentType;
    let viewName;
    let viewModel;

    const options = _.cloneDeep(action.payload.options);
    const modelNodeId = options.modelNodeId;
    let model;
    if (modelNodeId) {
      model = _.cloneDeep(graphTraversal.find(state.model, modelNodeId));
    } else {
      model = { parentId: action.payload.options.parentModelId, typeLabel: type };
    }

    if (!model.children) model.children = [];

    switch (type) {
      case PseudoModalTypes.ComponentTypes.Website: {
        viewName = EditorNames.EDIT_WEBSITE_DETAILS;
        break;
      }
      case PseudoModalTypes.ComponentTypes.WebFolder: {
        viewName = EditorNames.EDIT_WEBSITE_FOLDER_DETAILS;
        break;
      }
      case PseudoModalTypes.ComponentTypes.WebPage: {
        viewName = EditorNames.EDIT_WEBSITE_PAGE_DETAILS;
        viewModel = this.generateViewModel(this.WEB_PAGE_ROOT, model);
        break;
      }
      case PseudoModalTypes.WizardTypes.ConfigureDdl: {
        viewName = EditorNames.Wizards.CONFIGURE_DDL;
        break;
      }
      default: {
        throw new Error(`Action not yet configured to handle ${type}.`);
      }
    }

    const data = Object.assign({}, options, { id: f22Uuid.generate() }, { model }, { viewModel });

    return {
      viewName,
      data
    };
  }

  getPseudoModalData(type, state, modelNodeId) {
    // Note: This should be changed to just 'viewName'
    let viewName;
    let data;

    const model = _.cloneDeep(graphTraversal.find(state.model, modelNodeId));

    switch (type) {
      case PseudoModalTypes.WizardTypes.ConfigureDdl: {
        data = configureDdlWizardViewFactory.createInstance(model, this.getApplicationDatastores(state));
        viewName = EditorNames.Wizards.CONFIGURE_DDL;
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

  getApplicationDatastores(state) {
    return _.filter(state.model.appContainer.children, (child) => (child.typeLabel === ComponentTypes.Datastore));
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
      default: {
        throw new Error('Encountered error trying to determine view to create.');
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

export default new ActionComponentCreatorHandler();

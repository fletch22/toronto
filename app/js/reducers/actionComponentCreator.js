import _ from 'lodash';
import ComponentTypes from '../domain/component/ComponentTypes';
import EditorNames from '../component/editors/EditorNames';
import graphTraversal from '../state/graphTraversal';
import f22Uuid from '../util/f22Uuid';
import viewFactory from '../domain/component/view/viewFactory';
import modelGenerator from '../../js/domain/component/modelGenerator';

class ActionComponentCreator {

  constructor() {
    this.WEB_PAGE_ROOT = 'WEB_PAGE_ROOT';
  }

  createComponentEditorData(state, action) {
    const type = action.payload.componentType;
    let componentViewName;
    let viewModel;
    switch (type) {
      case ComponentTypes.Website: {
        componentViewName = EditorNames.EDIT_WEBSITE_DETAILS;
        break;
      }
      case ComponentTypes.WebFolder: {
        componentViewName = EditorNames.EDIT_WEBSITE_FOLDER_DETAILS;
        break;
      }
      case ComponentTypes.WebPage: {
        componentViewName = EditorNames.EDIT_WEBSITE_PAGE_DETAILS;
        break;
      }
      case ComponentTypes.Layout: {
        componentViewName = EditorNames.EDIT_LAYOUT_DETAILS;
        break;
      }
      default: {
        throw new Error(`Action not yet configured to handle ${type}.`);
      }
    }

    const options = _.cloneDeep(action.payload.options);
    const modelNodeId = options.modelNodeId;
    let model;
    if (modelNodeId) {
      model = _.cloneDeep(graphTraversal.find(state.model, modelNodeId));
    } else {
      model = { parentId: action.payload.options.parentModelId, typeLabel: type };
    }

    if (!model.children) model.children = [];

    if (type === ComponentTypes.WebPage) {
      viewModel = this.generateViewModel(this.WEB_PAGE_ROOT, model);
    }

    const data = Object.assign({}, options, { id: f22Uuid.generate() }, { model }, { viewModel });

    return {
      componentViewName,
      data
    };
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
      default: {
        throw new Error('Encountered error trying to determine view to create.');
      }
    }
    // const modelClone = _.cloneDeep(model);
    return Object.assign(view, { parentId: viewModelParentId }, { viewModel: this.generateChildrensViewModels(view.id, model) });
  }

  generateChildrensViewModels(viewModelParentId, modelParent) {
    const viewModelParent = Object.assign({}, modelParent);
    viewModelParent.children.forEach((model, index) => {
      viewModelParent.children[index] = this.generateViewModel(viewModelParentId, model);
    });

    return viewModelParent;
  }

  generatePageChildComponent(state, action) {
    throw new Error('Not implemented yet.');
    const options = _.cloneDeep(action.payload.options);
    const parentModel = graphTraversal.find(state, options.parentId);


    const model = modelGenerator.generate(parentModel.viewModel.id, action.payload.componentType);
    const viewModel = this.generateViewModel(model);

    parentModel.viewModel.children.push(viewModel);
  }

  extractModelFromViewModel(viewModel) {
    const clone = _.cloneDeep(viewModel.viewModel);
    clone.children = this.extractChildrenFromViewModel(clone.children);
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

export default new ActionComponentCreator();

import f22Uuid from '../util/f22Uuid';
import ComponentTypes from '../domain/component/ComponentTypes';
import ViewTypes from '../views/ViewTypes';
import _ from 'lodash';
import graphTraversal from '../state/graphTraversal';

class DashboardIslandViewModelFactory {

  constructor() {
    this.supportedTypes = [ComponentTypes.AppContainer, ComponentTypes.App, ComponentTypes.WebPage,
      ComponentTypes.Website, ComponentTypes.WebFolder];
  }

  createInstance(appContainer) {
    const viewModelId = f22Uuid.generate();

    const appContainerClone = _.cloneDeep(appContainer);

    const children = [this.generateViewModel(viewModelId, appContainerClone)];

    return {
      id: viewModelId,
      viewModel: {
        children
      },
      viewType: ViewTypes.Dashboard.Island
    };
  }

  createBaseIslandView() {
    return {
      id: f22Uuid.generate(),
      isTextInputFieldVisible: false,
      isShowingHeaderMenu: false
    };
  }

  generateViewModel(viewModelParentId, model) {
    let viewModel;

    if (this.supportedTypes.includes(model.typeLabel)) {
      const view = this.createBaseIslandView();
      viewModel = Object.assign(view, { parentId: viewModelParentId });
      viewModel = Object.assign(viewModel, { viewModel: this.generateChildrensViewModels(view.id, model) });
    }
    return viewModel;
  }

  generateChildrensViewModels(viewModelParentId, modelParent) {
    const modelParentClone = Object.assign({}, modelParent);
    if (modelParentClone.children) {
      const newChildren = [];
      modelParentClone.children.forEach((model) => {

        if (this.supportedTypes.includes(model.typeLabel)) {
          newChildren.push(this.generateViewModel(viewModelParentId, model));
        }
      });
      modelParentClone.children = newChildren;
    }
    return modelParentClone;
  }

  syncModelToViewModel(state, viewModel) {
    const appContainer = state.model.appContainer;

    /* eslint-disable  no-param-reassign */
    this.updatePropertiesInVmBase(viewModel, appContainer);

    // c.l('app children length: ' + appContainer.children.length);
    this.addNewChildren(appContainer, viewModel);
  }

  addNewChildren(parent, viewModel) {
    parent.children.forEach((child) => {

      if (this.supportedTypes.includes(child.typeLabel)) {
        const parentId = child.parentId;
        const modelId = child.id;

        // c.lo(child, 'Model: ');

        const parentChildViewModel = this.findParentChildViewModel(viewModel, parentId, modelId);
        // c.lo(parentChildViewModel, 'parentChildViewModel: ');
        if (!parentChildViewModel.child) {
          // c.l('Child not found.');
          // c.l('parentChildViewModel.parent.id: ' + parentChildViewModel.parent.id);
          const newViewModel = this.generateViewModel(parentChildViewModel.parent.id, child);
          // c.lo(newViewModel, 'newViewModel: ');
          parentChildViewModel.parent.viewModel.children.push(newViewModel);
          // c.lo('created newViewModel');
        }
        this.addNewChildren(child, viewModel);
      }
    });
  }

  updatePropertiesInVmBase(viewModelBase, parentModel) {
    const children = [];
    viewModelBase.viewModel.children.forEach((childVmBase) => {
      const viewModel = childVmBase.viewModel;

      let model = graphTraversal.find(parentModel, viewModel.id);
      if (model && this.supportedTypes.includes(model.typeLabel)) {
        this.updatePropertiesInVmBase(childVmBase, model);
        model = _.cloneDeep(model);
        delete model.children;
        Object.assign(viewModel, model);
        children.push(childVmBase);
      }
    });
    /* eslint-disable  no-param-reassign */
    viewModelBase.viewModel.children = children;
  }

  findParentChildViewModel(parentOuterViewModel, parentId, modelId) {
    const targetParentOuterVm = this.findOuterViewModel(parentOuterViewModel, parentId);
    if (!targetParentOuterVm) {
      throw new Error('Encountered problem trying to find parent. Could not find it.');
    }

    const childOuterVm = _.find(targetParentOuterVm.viewModel.children, (child) => {
      return child.viewModel.id === modelId;
    });

    return { parent: targetParentOuterVm, child: childOuterVm };
  }

  findOuterViewModel(outerViewModel, modelId) {
    let foundOuterVm = null;

    if (outerViewModel.viewModel.id === modelId) {
      foundOuterVm = outerViewModel;
    } else {
      const children = outerViewModel.viewModel.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.viewModel.id === modelId) {
          foundOuterVm = child;
          break;
        }
        foundOuterVm = this.findOuterViewModel(child, modelId);
        if (foundOuterVm) {
          break;
        }
      }
    }

    return foundOuterVm;
  }
}

export default new DashboardIslandViewModelFactory();

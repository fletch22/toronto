import graphTraversal from '../state/graphTraversal';
import actionComponentCreator from './viewModelFactory';

class ActionBodyChildSelectorHandler {

  process(state, targetViewModelId) {
    const pageAndSelected = this.getPageViewModelAndSelectedViewModel(state, targetViewModelId);
    const pageViewNode = pageAndSelected.pageViewModel;
    const intendedSelectedViewModel = pageAndSelected.selectedViewModel;

    if (pageViewNode.needsSaving) {
      return state;
    }

    intendedSelectedViewModel.isSelected = true;

    if (pageViewNode.selectedChildViewId && pageViewNode.selectedChildViewId !== targetViewModelId) {
      const parentOfExisting = graphTraversal.findParent(state, pageViewNode.selectedChildViewId);
      if (parentOfExisting) {
        const currentlySelectedViewModel = graphTraversal.find(parentOfExisting.viewModel, pageViewNode.selectedChildViewId);
        currentlySelectedViewModel.isSelected = false;

        parentOfExisting.viewModel.children = [].concat(parentOfExisting.viewModel.children);
      }
    }
    pageViewNode.selectedChildViewId = targetViewModelId;

    const borderScrivener = state.borderScrivener;
    borderScrivener.selectedElementId = pageViewNode.selectedChildViewId;
    borderScrivener.visible = !!borderScrivener.selectedElementId;

    return state;
  }

  getPageViewModelAndSelectedViewModel(state, childIdInQuestion) {
    const parentOfIntended = graphTraversal.findParent(state, childIdInQuestion);
    let pageViewModel;
    let selectedViewModel;

    if (parentOfIntended) {
      selectedViewModel = graphTraversal.find(parentOfIntended.viewModel, childIdInQuestion);

      parentOfIntended.viewModel.children = [].concat(parentOfIntended.viewModel.children);

      pageViewModel = selectedViewModel;
      let parentNodeId = selectedViewModel.parentId;
      while (parentNodeId !== actionComponentCreator.WEB_PAGE_ROOT) {
        const parentNode = graphTraversal.find(state, parentNodeId);
        if (!parentNode) {
          throw new Error('Encountered problem trying to find web page root node.');
        }
        parentNodeId = parentNode.parentId;
        pageViewModel = parentNode;
      }
    } else {
      pageViewModel = graphTraversal.find(state, childIdInQuestion);
      selectedViewModel = pageViewModel;
    }

    return {
      pageViewModel,
      selectedViewModel
    };
  }

  deselectCurrentComponent(state, selectedViewModelId) {
    const view = graphTraversal.find(state, selectedViewModelId);

    if (!!view) {
      view.isSelected = false;
    }

    const stateAndSel = this.getPageViewModelAndSelectedViewModel(state, selectedViewModelId);
    if (!!stateAndSel.pageViewModel) {
      stateAndSel.pageViewModel.selectedChildViewId = null;
    }
  }

  getPageViewModel(state, childIdInQuestion) {
    const stateAndSel = this.getPageViewModelAndSelectedViewModel(state, childIdInQuestion);
    return stateAndSel.pageViewModel;
  }
}

export default new ActionBodyChildSelectorHandler();

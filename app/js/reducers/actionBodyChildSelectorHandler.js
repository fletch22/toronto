import graphTraversal from '../state/graphTraversal';
import actionComponentCreator from './viewModelFactory';

class ActionBodyChildSelectorHandler {

  process(state, targetViewModelId) {
    const parentOfIntended = graphTraversal.findParent(state, targetViewModelId);
    let pageViewNode;

    if (parentOfIntended) {
      const intendedSelectedViewModel = graphTraversal.find(parentOfIntended.viewModel, targetViewModelId);
      intendedSelectedViewModel.isSelected = true;

      const borderScrivener = state.borderScrivener;
      borderScrivener.selectedElementId = intendedSelectedViewModel.id;
      borderScrivener.visible = !!borderScrivener.selectedElementId;

      c.lo(borderScrivener, 'bs: ');

      parentOfIntended.viewModel.children = [].concat(parentOfIntended.viewModel.children);

      pageViewNode = intendedSelectedViewModel;
      let parentNodeId = intendedSelectedViewModel.parentId;
      while (parentNodeId !== actionComponentCreator.WEB_PAGE_ROOT) {
        const parentNode = graphTraversal.find(state, parentNodeId);
        if (!parentNode) {
          throw new Error('Encountered problem trying to find web page root node.');
        }
        parentNodeId = parentNode.parentId;
        pageViewNode = parentNode;
      }
    } else {
      pageViewNode = graphTraversal.find(state, targetViewModelId);
      pageViewNode.isSelected = true;
    }

    if (pageViewNode.selectedChildViewId && pageViewNode.selectedChildViewId !== targetViewModelId) {
      const parentOfExisting = graphTraversal.findParent(state, pageViewNode.selectedChildViewId);
      if (parentOfExisting) {
        const currentlySelectedViewModel = graphTraversal.find(parentOfExisting.viewModel, pageViewNode.selectedChildViewId);
        currentlySelectedViewModel.isSelected = false;

        parentOfExisting.viewModel.children = [].concat(parentOfExisting.viewModel.children);
      }
    }
    pageViewNode.selectedChildViewId = targetViewModelId;

    return state;
  }
}

export default new ActionBodyChildSelectorHandler();

import graphTraversal from '../state/graphTraversal';
import actionComponentCreator from './actionComponentCreatorHandler';

class ActionBodyChildSelectorHandler {

  process(state, targetViewModelId) {
    const intendedSelectedViewModel = graphTraversal.find(state, targetViewModelId);
    intendedSelectedViewModel.isSelected = true;

    let pageViewNode = intendedSelectedViewModel;
    let parentNodeId = intendedSelectedViewModel.parentId;
    while (parentNodeId !== actionComponentCreator.WEB_PAGE_ROOT) {
      const parentNode = graphTraversal.find(state, parentNodeId);
      if (!parentNode) {
        throw new Error('Encountered problem trying to find web page root node.');
      }
      parentNodeId = parentNode.parentId;
      pageViewNode = parentNode;
    }

    if (pageViewNode.selectedChildViewId && pageViewNode.selectedChildViewId !== intendedSelectedViewModel.id) {
      const currentlySelectedViewModel = graphTraversal.find(state, pageViewNode.selectedChildViewId);
      currentlySelectedViewModel.isSelected = false;
    }
    pageViewNode.selectedChildViewId = targetViewModelId;

    return state;
  }
}

export default new ActionBodyChildSelectorHandler();

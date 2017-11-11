import graphTraversal from '../../state/graphTraversal';
import ComponentTypes from '../../domain/component/ComponentTypes';

class DndActionHandler {
  static handleHover(state, stateNew, hoverOveredId, draggedId, measurements) {
    const dragNDrop = stateNew.dragNDrop;

    dragNDrop.measurements = measurements;
    const position = dragNDrop.measurements.position;

    const draggedItem = graphTraversal.find(stateNew, draggedId);
    const parentOfDraggedItem = graphTraversal.find(stateNew, draggedItem.parentId);
    const indexCurrentDraggedItem = graphTraversal.getChildsIndex(parentOfDraggedItem.viewModel.children, draggedId);

    // NOTE: 10-03-2017: If we are dragging a new item or if the dragged item's parent is different or if the ordinal position of the
    // dragged item has changed
    if (draggedId !== dragNDrop.draggedId
    || (draggedItem.parentId !== parentOfDraggedItem.id || dragNDrop.indexDraggedItem !== indexCurrentDraggedItem)) {
      dragNDrop.draggedId = draggedId;
      dragNDrop.indexDraggedItem = indexCurrentDraggedItem;
      dragNDrop.parentOfDraggedItemId = draggedItem.parentId;
      draggedItem.visibility = false;
    }

    let parentOfHoverOver = null;

    // NOTE: 10-03-2017: If the thing we are hovering over is new, or the position has changed
    if (hoverOveredId !== dragNDrop.hoverOverId || position !== dragNDrop.position) {
      dragNDrop.hoverOverId = hoverOveredId;

      dragNDrop.lastChildViewModelId = null;
      if (position === 'middle') {
        // NOTE: 10-03-2017: The 'middle' position is possible only in containers that can be dropped into.
        // So change make the parent the drop target.
        dragNDrop.parentOfHoverOverId = hoverOveredId;
        parentOfHoverOver = graphTraversal.find(stateNew, dragNDrop.parentOfHoverOverId);

        // NOTE: 10-03-2017: Make the last child the ordinal drop position.
        dragNDrop.indexChildTarget = parentOfHoverOver.viewModel.children.length;

        // NOTE: 10-03-2017: Is there more than one child?
        if (parentOfHoverOver.viewModel.children.length > 0) {
          // NOTE: 10-03-2017: Does the hovered over component come after the dragged component and are they in the same container?
          if (dragNDrop.indexChildTarget > dragNDrop.indexDraggedItem
            && dragNDrop.parentOfDraggedItemId === dragNDrop.parentOfHoverOverId
            && dragNDrop.indexChildTarget === dragNDrop.parentOfHoverOverId) {
            dragNDrop.indexChildTarget--;
          }

          // NOTE: 10-03-2017: Pretend the container is empty.
          dragNDrop.lastChildViewModelId = parentOfHoverOver.viewModel.children[parentOfHoverOver.viewModel.children.length - 1].id;

          // NOTE: 10-03-2017: fleschec: Dragging over hidden dragged.
          if (dragNDrop.lastChildViewModelId === dragNDrop.draggedId) {
            // NOTE: 10-03-2017: Pretend the container is empty.
            if (parentOfHoverOver.viewModel.children.length === 1) {
              dragNDrop.lastChildViewModelId = null;
            } else {
              // NOTE: 10-03-2017: Otherwise use the previous component.
              dragNDrop.lastChildViewModelId = parentOfHoverOver.viewModel.children[parentOfHoverOver.viewModel.children.length - 2].id;
            }
          }
        }
      } else { // NOTE: 10-03-2017: The position is not middle
        parentOfHoverOver = graphTraversal.findParent(stateNew, dragNDrop.hoverOverId);

        // NOTE: 10-17-2017: If we are at the Body element, there is no parent.
        if (!!parentOfHoverOver) {
          dragNDrop.parentOfHoverOverId = parentOfHoverOver.id;
          const hoverChildsIndex = graphTraversal.getChildsIndex(parentOfHoverOver.viewModel.children, dragNDrop.hoverOverId);

          dragNDrop.indexChildTarget = (position === 'before') ? hoverChildsIndex : hoverChildsIndex + 1;
          dragNDrop.indexChildTarget = (dragNDrop.indexChildTarget < 0) ? 0 : dragNDrop.indexChildTarget;
        } else {
          // const hoveredOverVm = graphTraversal.find(stateNew, dragNDrop.hoverOverId);
          // const hoveredOverModel = graphTraversal.find(stateNew.model, hoveredOverVm.viewModel.id);

          dragNDrop.parentOfHoverOverId = null;
          dragNDrop.indexChildTarget = null;
        }
      }
    }

    /* eslint-disable no-param-reassign */
    stateNew.borderScrivener.selectedElementId = null;

    return stateNew;
  }
}

export default DndActionHandler;

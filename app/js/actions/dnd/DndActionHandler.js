import graphTraversal from '../../state/graphTraversal';

class DndActionHandler {
  static handleHover(state, stateNew, hoverOveredId, draggedId, position) {
    // c.l(`hoid: ${hoverOveredId}; pos: ${position}`);
    const dragNDrop = stateNew.dragNDrop;

    if (hoverOveredId !== dragNDrop.hoverOverId) {
      dragNDrop.hoverOverId = hoverOveredId;
      const parentOfHoverOver = graphTraversal.findParent(stateNew, dragNDrop.hoverOverId);
      dragNDrop.parentOfHoverOverId = parentOfHoverOver.id;
      let hoverChildsIndex = graphTraversal.getChildsIndex(parentOfHoverOver.viewModel.children, dragNDrop.hoverOverId);

      if (dragNDrop.parentOfHoverOverId === dragNDrop.parentOfDraggedItemId) {
        if (dragNDrop.indexDraggedItem < hoverChildsIndex) {
          hoverChildsIndex--;
        }
      }
      dragNDrop.indexChildTarget = (position === 'before') ? hoverChildsIndex : hoverChildsIndex + 1;
    }

    if (draggedId !== dragNDrop.draggedId) {
      dragNDrop.draggedId = draggedId;
      const draggedItem = graphTraversal.find(stateNew, draggedId);
      const parentOfDraggedItem = graphTraversal.find(stateNew, draggedItem.parentId);
      dragNDrop.indexDraggedItem = graphTraversal.getChildsIndex(parentOfDraggedItem.viewModel.children, dragNDrop.draggedId);
      dragNDrop.parentOfDraggedItemId = draggedItem.parentId;
      draggedItem.visibility = false;
    }

    let isMoveLegal = false;
    if (dragNDrop.parentOfDraggedItemId === dragNDrop.parentOfHoverOverId) {
      if (dragNDrop.draggedId !== dragNDrop.hoverOverId
        && dragNDrop.indexDraggedItem !== dragNDrop.indexChildTarget) {
        isMoveLegal = true;
      }
    } else {
      isMoveLegal = true;
    }

    if (isMoveLegal) {
      // stateNew.dragNDrop = JSON.parse(JSON.stringify(stateNew.dragNDrop));
      return stateNew;
    } else {
      return state;
    }
  }
}

export default DndActionHandler;

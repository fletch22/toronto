import graphTraversal from '../../state/graphTraversal';

class DndActionHandler {
  static handleHover(state, stateNew, hoverOveredId, draggedId, position) {
    // c.l(`hoid: ${hoverOveredId}; pos: ${position}`);
    const dragNDrop = stateNew.dragNDrop;

    if (hoverOveredId !== dragNDrop.hoverOverId) {
      dragNDrop.hoverOverId = hoverOveredId;
      const parentOfHoverOver = graphTraversal.findParent(stateNew, dragNDrop.hoverOverId);
      dragNDrop.parentOfHoverOverId = parentOfHoverOver.id;
      const hoverChildsIndex = graphTraversal.getChildsIndex(parentOfHoverOver.viewModel.children, dragNDrop.hoverOverId);
      dragNDrop.targetChildDropIndex = (position === 'before') ? hoverChildsIndex : hoverChildsIndex + 1;
    }

    if (draggedId !== dragNDrop.draggedId) {
      dragNDrop.draggedId = draggedId;
      const draggedItem = graphTraversal.find(stateNew, draggedId);
      const parentOfDraggedItem = graphTraversal.find(stateNew, draggedItem.parentId);
      dragNDrop.draggedItemOriginalIndex = graphTraversal.getChildsIndex(parentOfDraggedItem.viewModel.children, dragNDrop.draggedId);
      dragNDrop.parentOfDraggedItemId = draggedItem.parentId;
      draggedItem.visibility = false;
    }

    let isMoveLegal = false;
    if (dragNDrop.parentOfDraggedItemId === dragNDrop.parentOfHoverOverId) {
      if (dragNDrop.draggedItemOriginalIndex !== dragNDrop.targetChildDropIndex) {
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

export const ActionTypes = {
  DND: {
    HOVER_OVER: 'HOVER_OVER'
  }
};

export const actionHoverOver = (draggedId, hoverOveredId, position) => ({
  type: ActionTypes.DND.HOVER_OVER,
  payload: {
    draggedId,
    hoverOveredId,
    position
  }
});

export const ActionTypes = {
  GRID: {
    ADD_NEW_ROW_TO_COLLECTION: 'ADD_NEW_ROW_TO_COLLECTION',
    SELECT_ROWS: 'SELECT_ROWS',
    DESELECT_ROWS: 'DESELECT_ROWS'
  }
};

export const actionAddNewEmptyRowToGrid = (viewId) => ({
  type: ActionTypes.GRID.ADD_NEW_ROW_TO_COLLECTION,
  payload: {
    viewId
  }
});

export const actionSelectRows = (viewId, selectedIndexes) => ({
  type: ActionTypes.GRID.SELECT_ROWS,
  payload: {
    viewId,
    selectedIndexes
  }
});

export const actionDeselectRows = (viewId, selectedIndexes) => ({
  type: ActionTypes.GRID.DESELECT_ROWS,
  payload: {
    viewId,
    selectedIndexes
  }
});

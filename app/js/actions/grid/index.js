export const ActionTypes = {
  GRID: {
    ADD_NEW_ROW_TO_COLLECTION: 'ADD_NEW_ROW_TO_COLLECTION',
    SELECT_ROWS: 'SELECT_ROWS',
    DESELECT_ROWS: 'DESELECT_ROWS',
    UPDATE_ROW: 'UPDATE_ROW',
    SET_COLLECTION_ID: 'SET_COLLECTION_ID'
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

export const actionUpdateRow = (viewId, rowData) => ({
  type: ActionTypes.GRID.UPDATE_ROW,
  payload: {
    viewId,
    rowData
  }
});

export const actionSetCollectionId = (viewId, collectionId) => ({
  type: ActionTypes.GRID.SET_COLLECTION_ID,
  payload: {
    viewId,
    collectionId
  }
});

export const ActionTypes = {
  GRID: {
    SELECT_ROW: 'SELECT_ROW',
    DESELECT_ROW: 'DESELECT_ROWS',
    SET_COLLECTION_ID: 'SET_COLLECTION_ID',
    SHOW_GRID_DATA: 'SHOW_GRID_DATA',
    ROW_SAVED: 'ROW_SAVED'
  }
};

export const actionSelectRow = (viewId, selectedIndexes) => ({
  type: ActionTypes.GRID.SELECT_ROW,
  payload: {
    viewId,
    selectedIndexes
  }
});

export const actionDeselectRow = (viewId, deselectedIndexes) => ({
  type: ActionTypes.GRID.DESELECT_ROW,
  payload: {
    viewId,
    deselectedIndexes
  }
});

export const actionSetCollectionId = (viewId, collectionId) => ({
  type: ActionTypes.GRID.SET_COLLECTION_ID,
  payload: {
    viewId,
    collectionId
  }
});

export const actionShowModelData = (viewId, data) => ({
  type: ActionTypes.GRID.SHOW_GRID_DATA,
  payload: {
    viewId,
    data
  }
});

export const actionGridRowSaved = (viewId, rowSaved) => ({
  type: ActionTypes.GRID.ROW_SAVED,
  payload: {
    viewId,
    rowSaved
  }
});

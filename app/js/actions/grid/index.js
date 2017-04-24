export const ActionTypes = {
  GRID: {
    ADD_NEW_ROW_TO_COLLECTION: 'ADD_NEW_ROW_TO_COLLECTION'
  }
};

export const actionAddNewEmptyRowToGrid = (gridViewId) => ({
  type: ActionTypes.GRID.ADD_NEW_ROW_TO_COLLECTION,
  payload: {
    gridViewId
  }
});

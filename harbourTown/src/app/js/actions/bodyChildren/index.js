export const ACTIONS = {
  SET_COLLECTION: 'SET_COLLECTION'
};

export const ActionTypes = {
  BODY_CHILDREN: {}
};

ActionTypes.BODY_CHILDREN.DROP_DOWN_LISTBOX = ACTIONS;

export const actionSetCollection = (modelId, collection) => ({
  type: ActionTypes.BODY_CHILDREN.DROP_DOWN_LISTBOX.SET_COLLECTION,
  payload: {
    modelId,
    collection
  }
});

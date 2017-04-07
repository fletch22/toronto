export const ActionTypes = {
  ConfigureDdl: {
    SelectCollectionSlide: {
      TOGGLE_NEW_COLLECTION_NAME_INPUT: 'WIZ_CFGDDL_SEL_COLL_TOGGLE_NEW_COLLECTION_NAME_INPUT',
      SELECT_COLLECTION: 'SELECT_COLLECTION'
    }
  }
};

export const actionToggleNewItemNameInput = (uuid) => ({
  type: ActionTypes.ConfigureDdl.SelectCollectionSlide.TOGGLE_NEW_COLLECTION_NAME_INPUT,
  payload: {
    uuid
  }
});

export const actionSelectCollection = (wizardId, selectedCollectionId) => ({
  type: ActionTypes.ConfigureDdl.SelectCollectionSlide.SELECT_COLLECTION,
  payload: {
    wizardId,
    selectedCollectionId
  }
});

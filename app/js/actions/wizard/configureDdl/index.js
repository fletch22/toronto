export const ActionTypes = {
  ConfigureDdl: {
    SelectCollectionSlide: {
      TOGGLE_NEW_COLLECTION_NAME_INPUT: 'WIZ_CFGDDL_SEL_COLL_TOGGLE_NEW_COLLECTION_NAME_INPUT',
      SELECT_COLLECTION: 'SELECT_COLLECTION'
    },
    SelectFieldSlide: {
      SELECT_FIELD: 'SELECT_FIELD',
      SELECT_VALUE_FIELD: 'SELECT_VALUE_FIELD',
      SELECT_DISPLAY_FIELD: 'SELECT_DISPLAY_FIELD'
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

export const actionSelectField = (wizardViewId, selectedFieldId) => ({
  type: ActionTypes.ConfigureDdl.SelectFieldSlide.SELECT_FIELD,
  payload: {
    wizardViewId,
    selectedFieldId
  }
});

export const actionSetSelectValueField = (wizardViewId) => ({
  type: ActionTypes.ConfigureDdl.SelectFieldSlide.SELECT_VALUE_FIELD,
  payload: {
    wizardViewId
  }
});

export const actionSetSelectDisplayField = (wizardViewId) => ({
  type: ActionTypes.ConfigureDdl.SelectFieldSlide.SELECT_DISPLAY_FIELD,
  payload: {
    wizardViewId
  }
});

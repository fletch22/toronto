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
    },
    CreateCollectionSlide: {
      SHOW_MODEL_DATA: 'SHOW_MODEL_DATA',
      ADD_NEW_ROW_COLLECTION: 'ADD_NEW_ROW_COLLECTION'
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

export const actionShowModelData = (wizardViewId, pageData) => ({
  type: ActionTypes.ConfigureDdl.CreateCollectionSlide.SHOW_MODEL_DATA,
  payload: {
    wizardViewId,
    pageData
  }
});

export const actionAddEmptyRowToGrid = (viewId) => ({
  type: ActionTypes.ConfigureDdl.CreateCollectionSlide.ADD_NEW_ROW_COLLECTION,
  payload: {
    viewId
  }
});

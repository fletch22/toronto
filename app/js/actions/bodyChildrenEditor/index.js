export const ACTIONS = {
  SET_CURRENT_BODY_CHILD_TOOL: 'SET_CURRENT_BODY_CHILD_TOOL',
  SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL: 'SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL',
  UNSET_CURRENT_BODY: 'UNSET_CURRENT_BODY',
  TOGGLE_MINION_STATIC_LOCK: 'TOGGLE_MINION_STATIC_LOCK',
  TOGGLE_LAYOUT_MINION_BORDERS: 'TOGGLE_LAYOUT_MINION_BORDERS',
  SET_DATA_NARRATIVE_VIEW_PROPS: 'SET_DATA_NARRATIVE_VIEW_PROPS',
  PAGE_NEEDS_SAVING: 'PAGE_NEEDS_SAVING',
  PAGE_DOES_NOT_NEED_SAVING: 'PAGE_DOES_NOT_NEED_SAVING',
  SET_PAGE_NEEDS_SAVING: 'SET_PAGE_NEEDS_SAVING',
};

export const actionSetCurrentBodyTool = (viewModelId) => ({
  type: ACTIONS.SET_CURRENT_BODY_CHILD_TOOL,
  payload: {
    viewModelId
  }
});

export const actionSetCurrentBodyToolToParent = (viewModelId) => ({
  type: ACTIONS.SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL,
  payload: {
    viewModelId
  }
});

export const actionToggleMinionStaticLock = (selectedViewModelId) => ({
  type: ACTIONS.TOGGLE_MINION_STATIC_LOCK,
  payload: {
    selectedViewModelId
  }
});

export const actionSetDataNarrativeViewProps = (viewId, zoomFactor, viewCoordinateX, viewCoordinateY, persist) => ({
  type: ACTIONS.SET_DATA_NARRATIVE_VIEW_PROPS,
  payload: {
    viewId,
    zoomFactor,
    viewCoordinateX,
    viewCoordinateY,
    persist
  }
});

export const actionToggleLayoutMinionBorders = (viewId) => ({
  type: ACTIONS.TOGGLE_LAYOUT_MINION_BORDERS,
  payload: {
    viewId
  }
});

export const actionPageNeedsSaving = (viewId) => ({
  type: ACTIONS.PAGE_NEEDS_SAVING,
  payload: {
    viewId
  }
});

export const actionPageDoesNotNeedSaving = (viewId) => ({
  type: ACTIONS.PAGE_DOES_NOT_NEED_SAVING,
  payload: {
    viewId
  }
});

export const actionSetPageNeedsSaving = (viewId, needsSaving) => ({
  type: ACTIONS.SET_PAGE_NEEDS_SAVING,
  payload: {
    viewId,
    needsSaving
  }
});

export const actionUnsetCurrentBody = (selectedViewId) => ({
  type: ACTIONS.UNSET_CURRENT_BODY,
  payload: {
    selectedViewId
  }
});

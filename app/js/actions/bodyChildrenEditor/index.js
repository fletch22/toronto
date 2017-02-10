export const ACTIONS = {
  SET_CURRENT_BODY_CHILD_TOOL: 'SET_CURRENT_BODY_CHILD_TOOL',
  SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL: 'SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL',
  TOGGLE_MINION_STATIC_LOCK: 'TOGGLE_MINION_STATIC_LOCK',
  TOGGLE_LAYOUT_MINION_BORDERS: 'TOGGLE_LAYOUT_MINION_BORDERS'
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

export const actionToggleLayoutMinionBorders = (viewId) => ({
  type: ACTIONS.TOGGLE_LAYOUT_MINION_BORDERS,
  payload: {
    viewId
  }
});

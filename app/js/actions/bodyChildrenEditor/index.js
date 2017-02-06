export const ACTIONS = {
  SET_CURRENT_BODY_CHILD_TOOL: 'SET_CURRENT_BODY_CHILD_TOOL',
  SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL: 'SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL',
  TOGGLE_MINION_STATIC_LOCK: 'TOGGLE_MINION_STATIC_LOCK',
  TOGGLE_BORDER: 'TOGGLE_BORDER'
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

// Deprecated
export const actionToggleBorder = (viewId) => ({
  type: ACTIONS.TOGGLE_BORDER,
  payload: {
    viewId
  }
});

export const ACTIONS = {
  SET_CURRENT_BODY_CHILD_TOOL: 'SET_CURRENT_BODY_CHILD_TOOL',
  SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL: 'SET_CURRENT_BODY_CHILD_TO_PARENT_TOOL',
  TOGGLE_MINION_STATIC_LOCK: 'TOGGLE_MINION_STATIC_LOCK',
  TOGGLE_LAYOUT_MINION_BORDERS: 'TOGGLE_LAYOUT_MINION_BORDERS',
  SET_DATA_NARRATIVE_VIEW_PROPS: 'SET_DATA_NARRATIVE_VIEW_PROPS'
};

export const actionSetCurrentBodyTool = (viewModelId, rect) => ({
  type: ACTIONS.SET_CURRENT_BODY_CHILD_TOOL,
  payload: {
    viewModelId,
    rect
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

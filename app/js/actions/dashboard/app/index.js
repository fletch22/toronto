export const ACTIONS = {
  TOGGLE_HEADER_MENU: 'TOGGLE_HEADER_MENU',
  ADD_WEBSITE: 'ADD_WEBSITE'
};

export const actionAppToggleMenu = (modelId) => {
  return {
    type: ACTIONS.TOGGLE_HEADER_MENU,
    modelId
  };
};


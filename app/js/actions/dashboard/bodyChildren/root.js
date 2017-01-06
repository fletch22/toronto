export const ACTIONS = {
  ACTION_PROCESS_ROOT_LAYOUT: 'ACTION_PROCESS_ROOT_LAYOUT'
};

export const actionProcessRootLayout = (pageId, layout) => ({
  type: ACTIONS.ACTION_PROCESS_ROOT_LAYOUT,
  payload: {
    pageId,
    layout
  }
});

export const ActionTypes = {
  PROXY: {
    INVOKE: 'INVOKE'
  }
};

export const actionInvokeProxy = (key, args) => ({
  type: ActionTypes.PROXY.INVOKE,
  payload: {
    key,
    args
  }
});

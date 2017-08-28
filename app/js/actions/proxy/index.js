export const ActionTypes = {
  PROXY: {
    INVOKE: 'INVOKE'
  }
};

export const actionInvokeProxy = (fnHash, args) => ({
  type: ActionTypes.PROXY.INVOKE,
  payload: {
    fnHash,
    args
  }
});

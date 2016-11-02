export const ActionTypes = {
  MODAL: {
    MODAL_CONFIRM_SHOW: 'MODAL_CONFIRM_SHOW'
  }
};

export const actionShowConfirm = (headerText, bodyText, yesAction, noAction, cancelAction) => {
  return {
    type: ActionTypes.MODAL.MODAL_CONFIRM_SHOW,
    headerText,
    bodyText,
    yesAction,
    noAction,
    cancelAction
  };
};


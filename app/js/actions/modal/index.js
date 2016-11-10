export const ActionTypes = {
  MODAL: {
    MODAL_CONFIRM_SHOW: 'MODAL_CONFIRM_SHOW',
    MODAL_FORM_SHOW: 'MODAL_FORM_SHOW'
  }
};

export const ModalFormTypes = {
  APP: {
    CREATE_WEBSITE: 'CREATE_WEBSITE'
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

export const actionModalFormShow = (modalFormType) => ({
  type: ActionTypes.MODAL.MODAL_FORM_SHOW,
  modalFormType
});


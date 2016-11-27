export const ActionTypes = {
  MODAL: {
    MODAL_CONFIRM_SHOW: 'MODAL_CONFIRM_SHOW',
    MODAL_PSEUDO_SHOW: 'MODAL_PSEUDO_SHOW',
    MODAL_PSEUDO_FORGET: 'MODAL_PSEUDO_FORGET'
  }
};

export const ModalFormTypes = {
  APP: {
    CREATE_WEBSITE: 'CREATE_WEBSITE',
    EDIT_WEBSITE_DETAILS: 'EDIT_WEBSITE_DETAILS'
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

export const actionModalFormShow = (modalFormType, data) => ({
  type: ActionTypes.MODAL.MODAL_FORM_SHOW,
  modalFormType,
  payload: data
});

export const actionModalPseudoShow = (componentViewName, data) => ({
  type: ActionTypes.MODAL.MODAL_PSEUDO_SHOW,
  componentViewName,
  payload: data
});

export const actionModalPseudoForget = (id) => ({
  type: ActionTypes.MODAL.MODAL_PSEUDO_FORGET,
  payload: {
    id
  }
});


import React from 'react';
import StandardModal from './StandardModal';
import { connect } from 'react-redux';
import ModalTypes from './ModalTypes';
import { actionHideCurrentModal } from '../../actions/index';

export class ErrorModalDtoFactory {
  getInstance(headerText, bodyText, okAction) {
    return {
      headerText,
      bodyText,
      okAction,
      modalType: ModalTypes.ErrorModal
    };
  }
}

class ErrorModal extends React.Component {
  render() {
    return (
      <StandardModal showModal onOk={this.props.onOk} headerText={this.props.headerText} bodyText={this.props.bodyText} />
    );
  }
}

function onOkDispatch() {
  return (dispatch, getState) => {
    const state = getState();

    const errorModal = state.dom.modal[0];

    console.log(`OK Clicked: ${JSON.stringify(errorModal.okAction)}`);
    dispatch(errorModal.okAction);
  };
}

ErrorModal.propTypes = {
  showModal: React.PropTypes.bool,
  headerText: React.PropTypes.string,
  bodyText: React.PropTypes.string,
  onOk: React.PropTypes.func
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOk: () => {
      dispatch(onOkDispatch());
    }
  };
};

ErrorModal = connect(
  null,
  mapDispatchToProps
)(ErrorModal);

export default ErrorModal;

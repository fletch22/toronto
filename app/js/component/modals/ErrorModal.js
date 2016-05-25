import React from 'react';
import StandardModal from './StandardModal';
import { connect } from 'react-redux';
import ModalTypes from './ModalTypes';

export class ErrorModalDtoFactory {
  getInstance(headerText, bodyText, onOk) {
    console.log('Getting dto.');
    return {
      headerText,
      bodyText,
      onOk,
      type: ModalTypes.ErrorModal
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
  console.log('Ok Clicked.');
  // return (dispatch, getState) => {
  //   const state = getState();
  // };
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

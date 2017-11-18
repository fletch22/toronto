import React from 'react';
import StandardModal from './StandardModal';
import { connect } from 'react-redux';

class ErrorModal extends React.Component {
  render() {
    return (
      <StandardModal showModal okAction={this.props.okAction} headerText={this.props.headerText} bodyText={this.props.bodyText} />
    );
  }
}

ErrorModal.propTypes = {
  showModal: React.PropTypes.bool,
  headerText: React.PropTypes.string,
  bodyText: React.PropTypes.string,
  okAction: React.PropTypes.any
};

const mapStateToProps = (state) => {
  const errorModal = state.dom.modal[0];

  return {
    okAction: errorModal.okAction
  };
};

ErrorModal = connect(
  mapStateToProps,
  null
)(ErrorModal);

export default ErrorModal;

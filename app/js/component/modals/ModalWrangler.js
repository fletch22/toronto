import React from 'react';
import { connect } from 'react-redux';
import ErrorModal from './ErrorModal';
import ConfirmModal from './ConfirmModal';
import ModalTypes from './ModalTypes';

class ModalWrangler extends React.Component {
  render() {
    let modal = null;
    if (this.props.showErrorModal) {
      modal = <ErrorModal { ...this.props.passThroughProps } />;
    }
    if (this.props.showConfirmModal) {
      modal = <ConfirmModal showModal { ...this.props.passThroughProps } />;
    }

    return (
      <div>
        { modal }
      </div>
    );
  }
}

ModalWrangler.propTypes = {
  showErrorModal: React.PropTypes.bool,
  showConfirmModal: React.PropTypes.bool,
  passThroughProps: React.PropTypes.object
};

const mapStateToProps = (state) => {
  let showErrorModal = false;
  let showConfirmModal = false;
  let passThroughProps = {};

  if (state.dom.modal.length > 0) {
    const modal = state.dom.modal[0];
    switch (modal.modalType) {
      case ModalTypes.ErrorModal: {
        showErrorModal = true;
        passThroughProps = modal;
        break;
      }
      case ModalTypes.ConfirmModal: {
        showConfirmModal = true;
        passThroughProps = modal;
        break;
      }
      default: {
        throw new Error(`Encountered problem deciphering which modal type to create. Did not recognize modal type '${modal.type}'.`);
      }
    }
  }

  return {
    showErrorModal,
    showConfirmModal,
    passThroughProps
  };
};

ModalWrangler = connect(
  mapStateToProps,
  null
)(ModalWrangler);

export default ModalWrangler;

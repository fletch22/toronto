import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ErrorModal from './ErrorModal';
import ConfirmModal from './ConfirmModal';
import StandardModal from './StandardModal';
import ModalTypes from './ModalTypes';

class ModalWrangler extends React.Component {
  render() {
    let modal = null;

    c.lo(this.props.modal);

    if (this.props.modal) {
      switch (this.props.modal.modalType) {
        case ModalTypes.ErrorModal: {
          modal = <ErrorModal { ...this.props.modal } />;
          break;
        }
        case ModalTypes.ConfirmModal: {
          modal = <ConfirmModal showModal { ...this.props.modal } />;
          break;
        }
        case ModalTypes.StandardModal: {
          modal = <StandardModal showModal { ...this.props.modal } />;
          break;
        }
        default: {
          throw new Error(`Encountered problem deciphering which modal type to create. Did not recognize modal type '${this.props.modal.modalType}'.`);
        }
      }
    }

    return (
      <div>
        { modal }
      </div>
    );
  }
}

ModalWrangler.propTypes = {
  modal: PropTypes.object
};

const mapStateToProps = (state) => {
  let modal;
  if (state.dom.modal.length > 0) {
    modal = state.dom.modal[0];
  }

  return {
    modal
  };
};

ModalWrangler = connect(
  mapStateToProps,
  null
)(ModalWrangler);

export default ModalWrangler;

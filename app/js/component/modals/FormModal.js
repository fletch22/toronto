import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { actionHideCurrentModal } from '../../actions/index';
import { ModalFormTypes } from '../../actions/modal/index';

class FormModal extends React.Component {
  render() {
    let body;
    switch (this.props.modalFormType) {
      case ModalFormTypes.APP.CREATE_WEBSITE: {
        body = <div>This will be the create/update website content.</div>;
        break;
      }
      default: {
        console.warn(`Did not recognize form modal type '${this.props.modalFormType}'`);
      }
    }

    return (
      <Modal show={this.props.showModal} onHide={this.props.onCloseModal}>
        <Modal.Body>
          <div>
            { body }
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

FormModal.propTypes = {
  modalFormType: React.PropTypes.string,
  showModal: React.PropTypes.bool,
  onCloseModal: React.PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCloseModal: () => {
      dispatch(actionHideCurrentModal());
    }
  };
};

FormModal = connect(
  null,
  mapDispatchToProps
)(FormModal);

export default FormModal;


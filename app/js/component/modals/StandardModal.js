import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { actionHideCurrentModal } from '../../actions/index';

class StandardModal extends React.Component {
  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.onCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.headerText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {this.props.bodyText}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onOk}>OK</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

StandardModal.propTypes = {
  showModal: React.PropTypes.bool,
  onCloseModal: React.PropTypes.func.isRequired,
  onOk: React.PropTypes.func,
  bodyText: React.PropTypes.string,
  headerText: React.PropTypes.string,
  okAction: React.PropTypes.any
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCloseModal: () => {
      dispatch(actionHideCurrentModal());
    },
    onOk: () => {
      c.l(`Is array: ${Array.isArray(ownProps.okAction)}`);
      let actions = [ownProps.okAction];
      if (Array.isArray(ownProps.okAction)) {
        actions = ownProps.okAction;
      }
      actions.forEach((item) => {
        dispatch(item);
      });
    }
  };
};

StandardModal = connect(
  null,
  mapDispatchToProps
)(StandardModal);

export default StandardModal;


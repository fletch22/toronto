import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { actionHideCurrentModal } from '../../actions/index';

class ConfirmModal extends React.Component {
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
          <Button onClick={this.props.onYesClick} className="toolbar-button">Yes</Button>
          <Button onClick={this.props.onNoClick} className="toolbar-button">No</Button>
          <Button onClick={this.props.onCancelClick} className="toolbar-button">Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ConfirmModal.propTypes = {
  showModal: React.PropTypes.bool,
  onCloseModal: React.PropTypes.func.isRequired,
  bodyText: React.PropTypes.string,
  headerText: React.PropTypes.string,
  yesAction: React.PropTypes.object,
  noAction: React.PropTypes.object,
  cancelAction: React.PropTypes.object,
  onYesClick: React.PropTypes.func,
  onNoClick: React.PropTypes.func,
  onCancelClick: React.PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCloseModal: () => {
      dispatch(actionHideCurrentModal());
    },
    onYesClick: () => {
      dispatch(ownProps.yesAction);
    },
    onNoClick: () => {
      dispatch(ownProps.noAction);
    },
    onCancelClick: () => {
      dispatch(ownProps.cancelAction);
    }
  };
};

ConfirmModal = connect(
  null,
  mapDispatchToProps
)(ConfirmModal);

export default ConfirmModal;


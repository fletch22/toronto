import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { showModalOverlay } from '../../actions/index';

class StandardModal extends React.Component {

  render() {
    const divStyle = {
      display: 'none'
    };

    return (
      <Modal show={this.props.showModal} onHide={this.props.onCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.headerText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="standardModal" style={divStyle}></div>
            Modal content here
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

StandardModal.propTypes = {
  showModal: React.PropTypes.bool.isRequired,
  onCloseModal: React.PropTypes.func.isRequired,
  headerText: React.PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  return {
    showModal: (state.dom.showModalOverlay) ? state.dom.showModalOverlay : false,
    headerText: 'test'
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCloseModal: () => {
      dispatch(showModalOverlay(false));
    }
  };
};

StandardModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(StandardModal);

export default StandardModal;


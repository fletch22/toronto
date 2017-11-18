import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class CrusoeModal extends React.Component {

  render() {
    return (
      <Modal show={this.props.showModal}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.headerText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {this.props.bodyText1}
          </div>
          <br />
          <div>
            {this.props.bodyText2}
          </div>
          <div>
            {this.props.bodyText3}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

CrusoeModal.propTypes = {
  showModal: React.PropTypes.bool,
  bodyText1: React.PropTypes.string,
  bodyText2: React.PropTypes.string,
  bodyText3: React.PropTypes.string,
  headerText: React.PropTypes.string
};

export default CrusoeModal;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class PseudoModal extends React.Component {

  render() {
    return (
      <div>
        <div className="dashboard-canvas">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 cell" style={{ border: '1px solid crimson' }}>
                Berry
              </div>
              <div className="col-sm-3 cell" style={{ border: '1px solid green' }}>
                Banana
                <div className="close">
                  close
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="scrim" />
      </div>
    );
  }
}

PseudoModal.propTypes = {
  psuedoModals: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    pseudoModals: state.dom.pseudoModals
  };
};


PseudoModal = connect(
  mapStateToProps,
  null
)(PseudoModal);

export default PseudoModal;

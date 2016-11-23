import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionModalPseudoForget } from '../../../js/actions/modal/index';

class PseudoModal extends React.Component {

  render() {
    const width = (this.props.data && this.props.data.width) ? this.props.data.width : '400px';

    return (
      <div style={{ zIndex: this.props.zIndex }}>
        <div className="dashboard-canvas">
          <div className="container pseudo-modal-content" style={{ width }}>
            <div className="row">
              <div className="col-sm-12 cell" style={{ height: '200px' }}>
                <button type="button" className="btn btn-default close" onClick={this.props.onCloseModal}>close</button>
                Content
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
  id: PropTypes.string,
  data: PropTypes.object,
  zIndex: PropTypes.number,
  width: PropTypes.number,
  onCloseModal: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCloseModal: () => {
      dispatch(actionModalPseudoForget(ownProps.id));
    }
  };
};

PseudoModal = connect(
  null,
  mapDispatchToProps
)(PseudoModal);

export default PseudoModal;

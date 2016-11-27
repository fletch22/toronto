import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionModalPseudoForget } from '../../../js/actions/modal/index';
import ComponentModalNames from '../EditorNames';
import EditWebsiteDetails from '../orb/app/website/EditWebsiteWebsiteDetails';

class PseudoModal extends React.Component {

  render() {
    const width = (this.props.data && this.props.data.width) ? this.props.data.width : '700px';

    let component;
    if (this.props.viewName === ComponentModalNames.EDIT_WEBSITE_DETAILS) {
      component = <EditWebsiteDetails { ...this.props.data } onCancelClick={this.props.onCloseModal} />;
    }

    return (
      <div style={{ zIndex: this.props.zIndex }}>
        <div className="dashboard-canvas">
          <div className="container pseudo-modal-content" style={{ width }}>
            <div className="row">
              <div className="col-sm-12 cell" style={{ height: '200px' }}>
                <button type="button" className="btn btn-default close" onClick={this.props.onCloseModal}>close</button>
                { component }
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
  onCloseModal: PropTypes.func,
  viewName: PropTypes.string
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

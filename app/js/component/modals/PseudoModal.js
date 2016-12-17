import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionModalPseudoForget } from '../../../js/actions/modal/index';
import ComponentModalNames from '../EditorNames';
import EditWebsiteDetails from '../orb/app/website/EditWebsiteDetails';
import EditFolderDetails from '../orb/app/website/folder/EditFolderDetails';

class PseudoModal extends React.Component {

  render() {
    const width = (this.props.data && this.props.data.width) ? this.props.data.width : '700px';

    let component;
    switch (this.props.viewName) {
      case ComponentModalNames.EDIT_WEBSITE_DETAILS: {
        component = <EditWebsiteDetails { ...this.props.data } onCancelClick={this.props.onCloseModal} />;
        break;
      }
      case ComponentModalNames.EDIT_WEBSITE_FOLDER_DETAILS: {
        component = <EditFolderDetails { ...this.props.data } onCancelClick={this.props.onCloseModal} />;
        break;
      }
      default: {
        console.log('Encountered problem while trying to determine view name for pseudo modal.');
        break;
      }
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

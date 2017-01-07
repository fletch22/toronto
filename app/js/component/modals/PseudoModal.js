import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionModalPseudoForget } from '../../../js/actions/modal/index';
import ComponentModalNames from '../editors/EditorNames';
import WebsiteEditor from '../editors/appContainer/app/WebsiteEditor';
import FolderEditor from '../editors/appContainer/app/FolderEditor';
import PageEditor from '../editors/appContainer/app/PageEditor';

class PseudoModal extends React.Component {

  render() {
    const width = (this.props.data && this.props.data.width) ? this.props.data.width : '700px';

    let component;
    switch (this.props.viewName) {
      case ComponentModalNames.EDIT_WEBSITE_DETAILS: {
        component = <WebsiteEditor { ...this.props.data } onCancelClick={this.props.onCloseModal} />;
        break;
      }
      case ComponentModalNames.EDIT_WEBSITE_FOLDER_DETAILS: {
        component = <FolderEditor { ...this.props.data } onCancelClick={this.props.onCloseModal} />;
        break;
      }
      case ComponentModalNames.EDIT_WEBSITE_PAGE_DETAILS: {
        component = <PageEditor { ...this.props.data } onCancelClick={this.props.onCloseModal} />;
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
              <div className="col-sm-12 cell">
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

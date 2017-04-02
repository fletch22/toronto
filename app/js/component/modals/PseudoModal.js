import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionModalPseudoForget } from '../../../js/actions/modal/index';
import ComponentModalNames from '../editors/EditorNames';
import WebsiteEditor from '../editors/appContainer/app/WebsiteEditor';
import FolderEditor from '../editors/appContainer/app/FolderEditor';
import PageEditor from '../editors/appContainer/app/PageEditor';
import ConfigureDdlWizard from '../../component/bodyChildren/dropDownListbox/ConfigureDdlWizard';
import Button from '../../component/Button';

class PseudoModal extends React.Component {

  render() {
    let width = (this.props.data && this.props.data.width) ? this.props.data.width : '700px';

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
        width = (this.props.data && this.props.data.width) ? this.props.data.width : '1500px';
        break;
      }
      case ComponentModalNames.Wizards.ConfigureDdl: {
        component = <ConfigureDdlWizard { ...this.props.data } data={this.props.data} onCancelClick={this.props.onCloseModal} />;
        width = (this.props.data && this.props.data.width) ? this.props.data.width : '700px';
        break;
      }
      default: {
        console.error('Encountered problem trying to determine view name for pseudo modal.');
        break;
      }
    }

    return (
      <div style={{ zIndex: this.props.zIndex }}>
        <div className="dashboard-canvas">
          <div className="container pseudo-modal-content" style={{ width }}>
            <div className="row">
              <div className="col-sm-12 cell">
                <div style={{ textAlign: 'right' }}>
                  <Button faClass="fa-close" onClick={this.props.onCloseModal} tooltipText="Close" />
                </div>
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

const mapStateToProps = (state, ownProps) => {

  let data = ownProps.data;
  // data = _.cloneDeep(data);

  return {
    data
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCloseModal: () => {
      dispatch(actionModalPseudoForget(ownProps.id));
    }
  };
};

PseudoModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(PseudoModal);

export default PseudoModal;

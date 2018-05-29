import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actionModalPseudoForget } from '../../../js/actions/modal/index';
import ComponentModalNames from '../editors/EditorNames';
import WebsiteEditor from '../editors/appContainer/app/WebsiteEditor';
import FolderEditor from '../editors/appContainer/app/FolderEditor';
import PageEditor from '../editors/appContainer/app/PageEditor';
import ConfigureDdlWizard from '../../component/bodyChildren/dropDownListbox/ConfigureDdlWizard';
import Button from '../../component/Button';
import PseudoModalTypes from '../../component/modals/PseudoModalTypes';
import DataNarrativeEditor from '../../../js/component/editors/dataNarrative/DataNarrative';
import DnEditorTransferCase from '../../../js/component/editors/dataNarrative/dnEditorTransferCase/DnEditorTransferCase';

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
        break;
      }
      case PseudoModalTypes.WizardTypes.ConfigureDdl: {
        component = <ConfigureDdlWizard { ...this.props.data } data={this.props.data} onCancelClick={this.props.onCloseModal} />;
        break;
      }
      case PseudoModalTypes.DataNarrativeEditor: {
        component = <DataNarrativeEditor { ...this.props.data } data={this.props.data} onCancelClick={this.props.onCloseModal} />;
        break;
      }
      case PseudoModalTypes.DataNarrativeTransferCaseEditor: {
        component = <DnEditorTransferCase { ...this.props.data } data={this.props.data} onCancelClick={this.props.onCloseModal} containerHeight={625} containerWidth={960} />;
        break;
      }
      default: {
        console.error('Encountered problem trying to determine view name for pseudo modal.');
        break;
      }
    }

    const height = 670;
    const tabContentHeight = height - 80;

    return (
      <div>
        <div className="flex-normal dashboard-canvas" style={{ zIndex: this.props.zIndex }}>
          <div className={`pseudo-modal-content ${this.props.className}`} style={{ height: `${height}px` }}>
            <div className="flex-pseudo-modal" style={{ flexGrow: 1 }}>
              <div className="" style={{ flexGrow: 1 }}>
                {this.props.title}
              </div>
              <Button faClass="fa-close" onClick={this.props.onCloseModal} tooltipText="Close" />
            </div>
            <div className="flex-pseudo-modal" style={{ flexGrow: 1, height: `${tabContentHeight}px` }}>
              <div style={{ flexGrow: 1 }}>
                { component }
              </div>
            </div>
          </div>
        </div>
        <div className="scrim" style={{ zIndex: this.props.zIndex - 1 }} />
      </div>
    );
  }
}

PseudoModal.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  zIndex: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  onCloseModal: PropTypes.func,
  viewName: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string
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

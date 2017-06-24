import React, { PropTypes } from 'react';
import WizardSlides from '../WizardSlides';
import ButtonWizard from '../../ButtonWizard';
import { connect } from 'react-redux';
import { actionSaveDdlInfo } from '../../../../../../actions/wizard/configureDdl/index';
import PropPathTextInput from '../../../../../editors/PropPathTextInput';
import _ from 'lodash';

class SlideSaveDdlInfo extends React.Component {

  render() {
    let saveCssNames = 'btn btn-default';
    if (!this.props.saveEnabled) {
      saveCssNames += ' disabled';
    }

    return (
      <div className="wizard-config-ddl sel_view_coll-flex">
        <div className="sel_view_row_main">
          <h4>Save</h4>
          <div className="save-ddl-info">
            <div className="save-ddl-field-info">
              <div className="save-ddl-info-form-label">
                <label>DataStore: </label>
              </div>
              <div className="save-ddl-info-form-field">
                <span className="save-ddl-field-value">{this.props.dataStoreLabel}</span>
              </div>
            </div>
            <div className="save-ddl-field-info">
              <div className="save-ddl-info-form-label">
                <label>Data Source Type</label>:
              </div>
              <div className="save-ddl-info-form-field">
                <span className="save-ddl-field-value">{this.props.wizardData.dataSourceType}</span>
              </div>
            </div>
            <div className="save-ddl-field-info">
              <div className="save-ddl-info-form-label">
                <label>Collection</label>:
              </div>
              <div className="save-ddl-info-form-field">
                <span className="save-ddl-field-value">{this.props.wizardData.selectedDataModelLabel}</span>
              </div>
            </div>
            <div className="save-ddl-field-info">
              <div className="save-ddl-info-form-label">
                <label>Displayed Text Field</label>:
              </div>
              <div className="save-ddl-info-form-field">
                <span className="save-ddl-field-value">{this.props.wizardData.selectedTextFieldName}</span>
              </div>
            </div>
            <div className="save-ddl-field-info">
              <div className="save-ddl-info-form-label">
                <label>Value Field ID</label>:
              </div>
              <div className="save-ddl-info-form-field">
                <span className="save-ddl-field-value">{this.props.wizardData.selectedValueFieldName}</span>+
              </div>
            </div>
          </div>
        </div>
        <div className="sel-view-row-foot-name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardSlides.COLLECTION_GRID} label="Back" />
          <button className={saveCssNames} onClick={this.props.onSaveClick} aria-pressed="true">Save</button>
        </div>
      </div>
    );
  }
}

SlideSaveDdlInfo.propTypes = {
  wizardData: PropTypes.object,
  isSlideActive: PropTypes.bool,
  onSaveClick: PropTypes.func,
  onNameChange: PropTypes.func,
  saveEnabled: PropTypes.bool,
  dataStoreId: PropTypes.any,
  dataStoreLabel: PropTypes.string
};

const getComponentProps = (props) => {
  const wizardData = props.wizardData;
  const dataStoreId = wizardData.dataStoreId;
  const dataStoreLabel = wizardData.dataStoreLabel;

  return {
    wizardData,
    saveEnabled: true,
    dataStoreId,
    dataStoreLabel
  };
};

const mapStateToProps = (state, ownProps) => {
  return getComponentProps(ownProps);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSaveClick: () => {
      const props = getComponentProps(ownProps);
      dispatch(actionSaveDdlInfo(props.wizardData.parentComponentViewId, ownProps.dataSourceName,
        props.wizardData.dataSourceType, props.wizardData.selectedDataModelId, props.wizardData.selectedTextFieldId, props.wizardData.selectedValueFieldId));
    },
    onNameChange: () => {
      console.log('onNameChange...');
    }
  };
};

SlideSaveDdlInfo = connect(
  mapStateToProps,
  mapDispatchToProps
)(SlideSaveDdlInfo);

export default SlideSaveDdlInfo;

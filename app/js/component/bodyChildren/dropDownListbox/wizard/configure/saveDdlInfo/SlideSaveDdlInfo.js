import React, { PropTypes } from 'react';
import WizardSlides from '../WizardSlides';
import ButtonWizard from '../../ButtonWizard';
import { connect } from 'react-redux';
import viewModelCreator from '../../../../../../component/utils/viewModelCreator';
import graphTraversal from '../../../../../../state/graphTraversal';

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
                <span className="save-ddl-field-value">{this.props.dataStoreLabel}</span> (<span className="save-ddl-field-paren">{this.props.wizardData.dataSourceType}</span>)
              </div>
            </div>
            <div className="save-ddl-field-info">
              <div className="save-ddl-info-form-label">
                <label>Collection</label>:
              </div>
              <div className="save-ddl-info-form-field">
                <span className="save-ddl-field-value">{this.props.wizardData.dataModelLabel}</span>
              </div>
            </div>
            <div className="save-ddl-field-info">
              <div className="save-ddl-info-form-label">
                <label>Value Field ID</label>:
              </div>
              <div className="save-ddl-info-form-field">
                <span className="save-ddl-field-value">{this.props.wizardData.dataValueLabel}</span>
              </div>
            </div>
            <div className="save-ddl-field-info">
              <div className="save-ddl-info-form-label">
                <label>Displayed Text Field</label>:
              </div>
              <div className="save-ddl-info-form-field">
                <span className="save-ddl-field-value">{this.props.wizardData.dataTextLabel}</span>
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
  dataStoreLabel: PropTypes.string,
  onCloseModal: PropTypes.func
};

const getComponentProps = (props) => {
  const wizardData = props.wizardData;
  const dataStoreId = wizardData.dataStoreId;
  const dataStoreLabel = wizardData.dataStoreLabel;

  return {
    wizardData,
    saveEnabled: true,
    dataStoreId,
    dataStoreLabel,
    onCloseModal: props.onCloseModal
  };
};

const mapStateToProps = (state, ownProps) => {
  return getComponentProps(ownProps);
};

const doSaveAction = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const wizardData = ownProps.wizardData;

    const outerViewModel = graphTraversal.find(state, ownProps.wizardData.parentComponentViewId);
    outerViewModel.dataStoreId = wizardData.dataStoreId;
    outerViewModel.dataModelId = wizardData.dataModelId;
    outerViewModel.dataValueId = wizardData.dataValueId;
    outerViewModel.dataTextId = wizardData.dataTextId;

    outerViewModel.viewModel.dataStoreId = wizardData.dataStoreId;
    outerViewModel.viewModel.dataModelId = wizardData.dataModelId;
    outerViewModel.viewModel.dataValueId = wizardData.dataValueId;
    outerViewModel.viewModel.dataTextId = wizardData.dataTextId;

    const successCallback = () => {
      ownProps.onCloseModal();
    };

    viewModelCreator.update(dispatch, outerViewModel, successCallback);
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSaveClick: () => {
      dispatch(doSaveAction(ownProps));
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

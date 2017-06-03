import React, { PropTypes } from 'react';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import { connect } from 'react-redux';
import { actionUpdateViewPropertyValue } from '../../../../../actions/index';
import ConfigureDdlWizardViewFactory from '../../../../../component/bodyChildren/dropDownListbox/wizard/configure/ConfigureDdlWizardViewFactory';

class SelectDataSourceType extends React.Component {

  render() {
    return (
      <div className="wizard-config-ddl">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12 text-center">
                <h4>Choose A Data Source Type</h4>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 text-center">
                <div className="row btn-group-vertical wizard-data-source-buttons" role="group">
                  <button className="btn btn-default btn-lg" onClick={this.props.onCollectionClick}>Collections</button>
                  <button className="btn btn-default btn-lg disabled" onClick={this.props.onQueriesClick}>Queries</button>
                  <button className="btn btn-default btn-lg disabled" onClick={this.props.onExternalClick}>External</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sel_view_row_foot_name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_COLLECTION_VIEW} disabled={this.props.buttonNextDisabled} label="Next" />
        </div>
      </div>
    );
  }
}

SelectDataSourceType.propTypes = {
  wizardData: PropTypes.object,
  isSlideActive: PropTypes.bool,
  buttonNextDisabled: PropTypes.bool,
  createCollection: PropTypes.object,
  needsToMakeDataRequest: PropTypes.bool,
  gridViewModel: PropTypes.object,
  selectedDataModelId: PropTypes.any,
  onCollectionClick: PropTypes.func,
  onQueriesClick: PropTypes.func,
  onExternalClick: PropTypes.func,
  dataSourceType: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  const dataSourceType = ownProps.wizardData.dataSourceType;
  const buttonNextDisabled = (dataSourceType !== ConfigureDdlWizardViewFactory.Constants.DataSourceType.Collection);

  return {
    buttonNextDisabled,
    dataSourceType
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCollectionClick: () => {
      dispatch(actionUpdateViewPropertyValue(ownProps.wizardData.id, 'dataSourceType', ConfigureDdlWizardViewFactory.Constants.DataSourceType.Collection, true));
    },
    onQueriesClick: () => {
      dispatch(actionUpdateViewPropertyValue(ownProps.wizardData.id, 'dataSourceType', ConfigureDdlWizardViewFactory.Constants.DataSourceType.Query, true));
    },
    onExternalClick: () => {
      dispatch(actionUpdateViewPropertyValue(ownProps.wizardData.id, 'dataSourceType', ConfigureDdlWizardViewFactory.Constants.DataSourceType.External, true));
    }
  };
};

SelectDataSourceType = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectDataSourceType);

export default SelectDataSourceType;

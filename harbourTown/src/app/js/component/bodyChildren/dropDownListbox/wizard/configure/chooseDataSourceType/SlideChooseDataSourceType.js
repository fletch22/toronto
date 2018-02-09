import React, { PropTypes } from 'react';
import WizardSlides from '../WizardSlides';
import ButtonWizard from '../../ButtonWizard';
import { connect } from 'react-redux';
import { actionUpdateViewPropertyValue } from '../../../../../../actions/index';
import ConfigureDdlWizardViewFactory from '../ConfigureDdlWizardViewFactory';

class SlideChooseDataSourceType extends React.Component {

  render() {
    let classNameCollButton = 'btn btn-default btn-lg';
    classNameCollButton = (this.props.collectionsButtonsActive) ? `${classNameCollButton} active` : classNameCollButton;

    return (
      <div className="wizard-config-ddl sel_view_coll-flex">
        <div className="sel_view_row_main">
            <div className="text-center">
              <h4>Choose A Data Source Type</h4>
            </div>
            <div className="col-md-12 text-center">
              <div className="row btn-group-vertical wizard-data-source-buttons" role="group">
                <button className={classNameCollButton} onClick={this.props.onCollectionClick}aria-pressed="true">Collections</button>
                <button className="btn btn-default btn-lg disabled" onClick={this.props.onQueriesClick} aria-pressed="true">Queries</button>
                <button className="btn btn-default btn-lg disabled" onClick={this.props.onExternalClick} aria-pressed="true">External</button>
              </div>
            </div>
        </div>
        <div className="sel-view-row-foot-name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardSlides.SELECT_OR_ADD_COLLECTION} disabled={this.props.buttonNextDisabled} label="Next" />
        </div>
      </div>
    );
  }
}

SlideChooseDataSourceType.propTypes = {
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
  dataSourceType: PropTypes.string,
  collectionsButtonsActive: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  const dataSourceType = ownProps.wizardData.dataSourceType;
  const collectionsButtonsActive = (dataSourceType === ConfigureDdlWizardViewFactory.Constants.DataSourceType.Collection);
  const buttonNextDisabled = !collectionsButtonsActive;

  return {
    buttonNextDisabled,
    dataSourceType,
    collectionsButtonsActive
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

SlideChooseDataSourceType = connect(
  mapStateToProps,
  mapDispatchToProps
)(SlideChooseDataSourceType);

export default SlideChooseDataSourceType;

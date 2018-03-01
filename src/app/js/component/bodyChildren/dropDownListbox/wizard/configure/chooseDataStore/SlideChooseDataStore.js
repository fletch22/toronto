import React, { PropTypes } from 'react';
import WizardSlides from '../WizardSlides';
import ButtonWizard from '../../ButtonWizard';
import { connect } from 'react-redux';
import dataUniverseModelUtils from '../../../../../../../../common/domain/component/dataUniverseModelUtils';
import dataStoreModelUtils from '../../../../../../../../common/domain/component/dataStoreModelUtils';
import { actionSelectDataStore } from '../../../../../../actions/wizard/configureDdl/index';


class SlideChooseDataStore extends React.Component {

  render() {
    let choices = this.props.dataStores;

    if (choices.length > 0) {
      choices = choices.map((choice, index) => {
        let classes = 'list-group-item list-group-item-action';

        if (choice.id === this.props.dataStoreId) {
          classes += ' wiz-sel-coll-selected-collection';
        }

        return (<a href="#" key={index} className={classes} data-value={choice.id} data-label={choice.label} onFocus={this.props.onCollectionFocus}>
          {choice.label}
        </a>);
      });
    } else {
      choices = (
        <div className="wiz-sel-coll-no-sel-coll">(no collections)</div>
      );
    }

    return (
      <div className="wizard-config-ddl sel_view_coll-flex">
        <div className="sel_view_row_main">
            <label>Select DataStore:</label>
            <div className="list-group wiz-sel-coll">
              {
                choices
              }
            </div>
        </div>
        <div className="sel-view-row-foot-name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardSlides.CHOOSE_DATASOURCE_TYPE} disabled={this.props.buttonNextDisabled} label="Next" />
        </div>
      </div>
    );
  }
}

SlideChooseDataStore.propTypes = {
  wizardData: PropTypes.object,
  isSlideActive: PropTypes.bool,
  buttonNextDisabled: PropTypes.bool,
  dataStores: PropTypes.array,
  dataStoreId: PropTypes.any,
  onCollectionFocus: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
  const dataStores = dataStoreModelUtils.getDataStores(dataUniverse);
  const dataStoreId = ownProps.wizardData.dataStoreId;
  const buttonNextDisabled = (dataStoreId === null);

  return {
    wizardData: ownProps.wizardData,
    dataStores,
    buttonNextDisabled,
    dataStoreId
  };
};

const doCollectionFocusAction = (event, ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    // const props = partialFlatten(state, ownProps);
    const dataStoreId = parseInt(event.target.dataset.value, 10);
    const selectedDataStoreLabel = event.target.dataset.label;

    dispatch(actionSelectDataStore(ownProps.wizardData.id, dataStoreId, selectedDataStoreLabel));
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCollectionFocus: (event) => {
      dispatch(doCollectionFocusAction(event, ownProps));
    }
  };
};

SlideChooseDataStore = connect(
  mapStateToProps,
  mapDispatchToProps
)(SlideChooseDataStore);

export default SlideChooseDataStore;

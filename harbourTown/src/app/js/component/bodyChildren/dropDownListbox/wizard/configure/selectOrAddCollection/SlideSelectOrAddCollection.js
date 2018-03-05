import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import WizardSlides from '../WizardSlides';
import ButtonWizard from '../../ButtonWizard';
import ToolbarSelectOrAddCollection from './ToolbarSelectOrAddCollection';
import { actionToggleNewItemNameInput, actionSelectDataModel } from '../../../../../../actions/wizard/configureDdl/index';
import CreateNewItem from '../CreateNewItem';
import dataModelModelFactory from '../../../../../../domain/component/dataModelModelFactory';
import viewModelCreator from '../../../../../utils/viewModelCreator';
import { actionUpdatePropertyWithPersist } from '../../../../../../actions/index';
import dataUniverseModelUtils from '../../../../../../domain/component/dataUniverseModelUtils';
import dataStoreModelUtils from '../../../../../../domain/component/dataStoreModelUtils';
import graphTraversal from '../../../../../../../../common/state/graphTraversal';
import stateTraversal from '../../../../../../../../common/state/stateTraversal';

class SlideSelectOrAddCollection extends React.Component {

  render() {
    let choices = this.props.collections;

    // c.lo(choices, 'choices: ');

    if (choices.length > 0) {
      choices = choices.map((choice, index) => {
        let classes = 'list-group-item list-group-item-action';

        if (choice.id === this.props.selectedDataModelId) {
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
          <label>Select Collection:</label>
          <div className="list-group wiz-sel-coll">
            {
              choices
            }
          </div>
          <div className="sel_view_row_edit_controls">
            <ToolbarSelectOrAddCollection onClickAdd={this.props.onClickAddCollection}
              onClickRemove={this.props.onClickRemoveCollection}
              disableButtons={this.props.disableToolbarButtons}
            />
            <div style={{ clear: 'both' }}>
              <CreateNewItem
                viewModel={this.props.viewModel}
                newItemNameInput={this.props.newItemNameInput}
                visible={this.props.newCollectionNameInputVisible}
                onClickSave={this.props.onClickSaveCollection}
              />
            </div>
          </div>
        </div>
        <div className="sel-view-row-foot-name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardSlides.CHOOSE_DATASOURCE_TYPE} label="Back" />
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardSlides.SELECT_FIELDS} disabled={this.props.buttonNextDisabled} label="Next" />
        </div>
      </div>
    );
  }
}

SlideSelectOrAddCollection.propTypes = {
  wizardData: PropTypes.object,
  onClickAddCollection: PropTypes.func,
  onClickRemoveCollection: PropTypes.func,
  viewModel: PropTypes.object,
  selectedDataModelId: PropTypes.number,
  buttonNextDisabled: PropTypes.bool,
  selectCollection: PropTypes.object,
  newItemNameInput: PropTypes.object,
  newCollectionNameInputVisible: PropTypes.bool,
  disableToolbarButtons: PropTypes.bool,
  onCollectionFocus: PropTypes.func,
  isSlideActive: PropTypes.bool,
  onClickSaveCollection: PropTypes.func,
  collections: PropTypes.array
};

const partialFlatten = (state, ownProps) => {
  const wizardData = ownProps.wizardData;
  const slide = wizardData.slides.selectCollection;
  const newItemNameInput = slide.newItemNameInput;

  const dataUniverse = dataUniverseModelUtils.getDataUniverse(state);
  const dataStores = dataStoreModelUtils.getDataStores(dataUniverse);
  const selectedDataStore = dataStoreModelUtils.findById(dataStores, wizardData.dataStoreId);

  // c.lo(selectedDataStore, 'selectedDataStore: ');

  let collections = [];
  if (selectedDataStore) {
    collections = selectedDataStore.children;
  }

  return {
    wizardData,
    viewModel: wizardData.viewModel,
    buttonNextDisabled: (wizardData.dataModelId === null),
    selectCollection: slide,
    newItemNameInput,
    newCollectionNameInputVisible: newItemNameInput.visible,
    disableToolbarButtons: newItemNameInput.visible,
    selectedDataModelId: wizardData.dataModelId,
    collections
  };
};

const mapStateToProps = (state, ownProps) => {
  return partialFlatten(state, ownProps);
};

const doCollectionFocusAction = (event, ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const props = partialFlatten(state, ownProps);
    const selectedDataModelId = parseInt(event.target.dataset.value, 10);
    const selectedDataModelLabel = event.target.dataset.label;

    dispatch(actionSelectDataModel(props.wizardData.id, selectedDataModelId, selectedDataModelLabel));
  };
};

const doSaveCollectionAction = (event, ownProps) => (
  (dispatch, getState) => {
    const state = getState();
    const props = partialFlatten(state, ownProps);

    const protoModel = { id: stateTraversal.getNextId(state), parentId: props.viewModel.viewModel.id, label: props.newItemNameInput.value };

    c.lo(protoModel, 'protoModel: ');

    const model = dataModelModelFactory.createInstanceFromModel(protoModel);

    const newItemNameInput = graphTraversal.find(state, props.newItemNameInput.id);
    newItemNameInput.value = '';
    newItemNameInput.visible = false;

    return viewModelCreator.create(dispatch, model, props.viewModel.id);
  }
);

const doAddCollectionAction = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const props = Object.assign({}, ownProps, partialFlatten(state, ownProps));
    if (!props.disableToolbarButtons) {
      dispatch(actionToggleNewItemNameInput(props.newItemNameInput.id));
    }
  };
};

const doRemoveCollectionAction = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();
    const flatProps = Object.assign({}, ownProps, partialFlatten(state, ownProps));
    if (!flatProps.disableToolbarButtons) {
      alert('not yet implemented.');
    }
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickAddCollection: () => {
      dispatch(doAddCollectionAction(ownProps));
    },
    onClickRemoveCollection: () => {
      dispatch(doRemoveCollectionAction(ownProps));
    },
    onCollectionFocus: (event) => {
      dispatch(doCollectionFocusAction(event, ownProps));
    },
    onClickSaveCollection: () => {
      dispatch(doSaveCollectionAction(event, ownProps));
    }
  };
};

SlideSelectOrAddCollection = connect(
  mapStateToProps,
  mapDispatchToProps
)(SlideSelectOrAddCollection);

export default SlideSelectOrAddCollection;

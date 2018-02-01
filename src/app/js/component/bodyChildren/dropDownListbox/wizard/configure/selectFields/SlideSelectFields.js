import React, { PropTypes } from 'react';
import _ from 'lodash';
import WizardSlides from '../WizardSlides';
import ButtonWizard from '../../ButtonWizard';
import { connect } from 'react-redux';
import ToolbarSelectOrAddCollection from '../selectOrAddCollection/ToolbarSelectOrAddCollection';
import ToolbarSelectFields from './ToolbarSelectFields';
import CreateNewItem from '../CreateNewItem';
import { actionToggleNewItemNameInput, actionSelectField } from '../../../../../../actions/wizard/configureDdl/index';
import dataModelFieldFactory from '../../../../../../domain/component/dataModelFieldFactory';
import viewModelCreator from '../../../../../utils/viewModelCreator';
import { actionUpdatePropertyWithPersist } from '../../../../../../actions/index';
import graphTraversal from "../../../../../../../../common/state/graphTraversal";
import dataModelModelFactory from "../../../../../../domain/component/dataModelModelFactory";
import stateTraversal from "../../../../../../state/stateTraversal";

class SlideSelectFields extends React.Component {

  render() {
    let choices = this.props.collectionFields;

    if (choices.length > 0) {
      choices = choices.map((choice, index) => {
        let classes = 'list-group-item list-group-item-action';

        if (choice.viewModel.id === this.props.selectedFieldId) {
          classes += ' wiz-sel-coll-selected-collection';
        }

        let selValueAttribute;
        if (choice.viewModel.id === this.props.dataValueId) {
          selValueAttribute = (
            <div className="wiz-config-ddl-sel-field">
              <div className="fa fa-id-card-o" />
            </div>
          );
        }

        let selDisplayAttribute;
        if (choice.viewModel.id === this.props.dataTextId) {
          selDisplayAttribute = (
            <div className="wiz-config-ddl-sel-field">
              <div className="fa fa-text-width" />
            </div>
          );
        }

        return (<a href="#" key={index} className={classes} data-value={choice.viewModel.id} data-label={choice.viewModel.label} onFocus={this.props.onFieldFocus}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '2 0 0' }}>{choice.viewModel.label}</div>
            {
              selValueAttribute
            }
            {
              selDisplayAttribute
            }
          </div>
        </a>);
      });
    } else {
      choices = (
        <div className="wiz-sel-coll-no-sel-coll">(no fields)</div>
      );
    }

    return (
      <div className="wizard-config-ddl sel_view_coll-flex">
        <div className="sel_view_row_main">
          <label>Select Fields:</label>
          <div className="list-group wiz-sel-coll">
            {
              choices
            }
          </div>
          <div className="sel_view_row_edit_controls">
            <div>
              <ToolbarSelectOrAddCollection onClickAdd={this.props.onClickAddField}
                onClickRemove={this.props.onClickRemoveField}
                disableButtons={this.props.disableToolbarButtons}
              />
              <ToolbarSelectFields wizardViewId={this.props.wizardData.id} disableButtons={this.props.disableToolbarButtons} />
            </div>
          </div>
          <div style={{ clear: 'both' }}>
            <CreateNewItem
              viewModel={this.props.viewModel}
              newItemNameInput={this.props.newItemNameInput}
              visible={this.props.newItemNameInputVisible}
              onClickSave={this.props.onClickSaveField}
            />
          </div>
        </div>

        <div className="sel-view-row-foot-name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardSlides.SELECT_OR_ADD_COLLECTION} label="Back" />
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardSlides.COLLECTION_GRID} disabled={this.props.buttonNextDisabled} label="Next" />
        </div>
      </div>
    );
  }
}

SlideSelectFields.propTypes = {
  wizardData: PropTypes.object,
  onClickAddField: PropTypes.func,
  onClickRemoveField: PropTypes.func,
  viewModel: PropTypes.object,
  selectContainerFields: PropTypes.object,
  dataValueId: PropTypes.number,
  dataTextId: PropTypes.number,
  buttonNextDisabled: PropTypes.bool,
  newItemNameInput: PropTypes.object,
  newItemNameInputVisible: PropTypes.bool,
  disableToolbarButtons: PropTypes.bool,
  onFieldFocus: PropTypes.func,
  isSlideActive: PropTypes.bool,
  selectedFieldId: PropTypes.number,
  onClickSaveField: PropTypes.func,
  collectionFields: PropTypes.array
};

const partialFlatten = (ownProps) => {
  const wizardData = ownProps.wizardData;
  const slide = wizardData.slides.selectContainerFields;
  const newItemNameInput = slide.newItemNameInput;

  const collections = wizardData.viewModel.viewModel.children;
  const collection = _.find(collections, (coll) => coll.viewModel.id === wizardData.dataModelId);

  let collectionFields = [];
  if (collection) {
    collectionFields = collection.viewModel.children;
  }

  return {
    wizardData,
    viewModel: wizardData.viewModel,
    buttonNextDisabled: (wizardData.dataValueId === null || wizardData.dataTextId === null),
    selectContainerFields: slide,
    newItemNameInput,
    newItemNameInputVisible: newItemNameInput.visible,
    disableToolbarButtons: newItemNameInput.visible,
    dataValueId: wizardData.dataValueId,
    dataTextId: wizardData.dataTextId,
    collectionFields,
    selectedFieldId: slide.selectedFieldId
  };
};

const mapStateToProps = (state, ownProps) => {
  return partialFlatten(ownProps);
};

const doSaveFieldAction = (ownProps) => (
  (dispatch, getState) => {
    const state = getState();
    const props = partialFlatten(ownProps);

    const vmDataStore = props.viewModel;
    const vmDataModel = vmDataStore.viewModel.children.find((child) => child.viewModel.id === props.wizardData.dataModelId);
    c.lo(vmDataModel, 'vmDataModel: ');

    const parentId = props.wizardData.dataModelId;
    const protoModel = { id: stateTraversal.getNextId(state.model), parentId, label: props.newItemNameInput.value };
    const model = dataModelFieldFactory.createInstanceFromModel(protoModel);

    const newItemNameInput = graphTraversal.find(state, props.newItemNameInput.id);
    newItemNameInput.value = '';
    newItemNameInput.visible = false;

    c.lo(vmDataModel.id, 'vmDataModel.id: ');
    return viewModelCreator.create(dispatch, model, vmDataModel.id);
  }
);

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickAddField: () => {
      const props = Object.assign({}, ownProps, partialFlatten(ownProps));
      if (!props.disableToolbarButtons) {
        dispatch(actionToggleNewItemNameInput(props.newItemNameInput.id));
      }
    },
    onClickRemoveField: () => {
      const flatProps = Object.assign({}, ownProps, partialFlatten(ownProps));
      if (!flatProps.disableToolbarButtons) {
        alert('not yet implemented.');
      }
    },
    onFieldFocus: (event) => {
      const props = partialFlatten(ownProps);
      const selectedFieldId = parseInt(event.target.dataset.value, 10);
      const selectedFieldLabel = event.target.dataset.label;

      dispatch(actionSelectField(props.selectContainerFields.id, selectedFieldId, selectedFieldLabel));
    },
    onClickSaveField: () => {
      const props = partialFlatten(ownProps);

      dispatch(doSaveFieldAction(props));
    }
  };
};


SlideSelectFields = connect(
  mapStateToProps,
  mapDispatchToProps
)(SlideSelectFields);

export default SlideSelectFields;

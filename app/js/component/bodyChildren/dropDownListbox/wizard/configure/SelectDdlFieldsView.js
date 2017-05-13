import React, { PropTypes } from 'react';
import _ from 'lodash';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import { connect } from 'react-redux';
import SelectItemOrContainerToolbar from './SelectItemOrContainerToolbar';
import SelectFieldsToolbar from './SelectFieldsToolbar';
import CreateItemForContainer from './selectCollection/CreateItemForContainer';
import { actionToggleNewItemNameInput, actionSelectField } from '../../../../../actions/wizard/configureDdl/index';
import dataModelFieldFactory from '../../../../../domain/component/dataModelFieldFactory';
import viewModelCreator from '../../../../utils/viewModelCreator';
import { actionUpdatePropertyWithPersist } from '../../../../../actions/index';

class SelectDdlFieldsView extends React.Component {

  render() {
    let choices = this.props.collectionFields;

    if (choices.length > 0) {
      choices = choices.map((choice, index) => {
        let classes = 'list-group-item list-group-item-action';

        if (choice.viewModel.id === this.props.selectedFieldId) {
          classes += ' wiz-sel-coll-selected-collection';
        }

        let selValueAttribute;
        if (choice.viewModel.id === this.props.selectedValueFieldId) {
          selValueAttribute = (
            <div className="wiz-config-ddl-sel-field">
              <div className="fa fa-id-card-o" />
            </div>
          );
        }

        let selDisplayAttribute;
        if (choice.viewModel.id === this.props.selectedTextFieldId) {
          selDisplayAttribute = (
            <div className="wiz-config-ddl-sel-field">
              <div className="fa fa-text-width" />
            </div>
          );
        }

        return (<a href="#" key={index} className={classes} data-value={choice.viewModel.id} onFocus={this.props.onFieldFocus}>
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
              <SelectItemOrContainerToolbar onClickAdd={this.props.onClickAddField}
                onClickRemove={this.props.onClickRemoveField}
                disableButtons={this.props.disableToolbarButtons}
              />
              <SelectFieldsToolbar wizardViewId={this.props.wizardData.id} disableButtons={this.props.disableToolbarButtons} />
            </div>
          </div>
          <div style={{ clear: 'both' }}>
            <CreateItemForContainer
              viewModel={this.props.viewModel}
              newItemNameInput={this.props.newItemNameInput}
              visible={this.props.newItemNameInputVisible}
              onClickSave={this.props.onClickSaveField}
            />
          </div>
        </div>

        <div className="sel_view_row_foot_name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_COLLECTION_VIEW} label="Back" />
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.CREATE_COLLECTION} disabled={this.props.buttonNextDisabled} label="Next" />
        </div>
      </div>
    );
  }
}

SelectDdlFieldsView.propTypes = {
  wizardData: PropTypes.object,
  onClickAddField: PropTypes.func,
  onClickRemoveField: PropTypes.func,
  viewModel: PropTypes.object,
  selectContainerFields: PropTypes.object,
  selectedValueFieldId: PropTypes.number,
  selectedTextFieldId: PropTypes.number,
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
  const collection = _.find(collections, (coll) => {
    return coll.viewModel.id === wizardData.selectedDataModelId;
  });

  let collectionFields = [];
  if (collection) {
    collectionFields = collection.viewModel.children;
  }

  return {
    wizardData,
    viewModel: wizardData.viewModel,
    buttonNextDisabled: slide.buttonNextDisabled,
    selectContainerFields: slide,
    newItemNameInput,
    newItemNameInputVisible: newItemNameInput.visible,
    disableToolbarButtons: newItemNameInput.visible,
    selectedDataModelId: wizardData.selectedDataModelId,
    selectedValueFieldId: wizardData.selectedValueFieldId,
    selectedTextFieldId: wizardData.selectedTextFieldId,
    selectedFieldId: slide.selectedFieldId,
    collectionFields
  };
};

const mapStateToProps = (state, ownProps) => {
  return partialFlatten(ownProps);
};

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
      dispatch(actionSelectField(props.selectContainerFields.id, selectedFieldId));
    },
    onClickSaveField: () => {
      const props = partialFlatten(ownProps);

      const model = dataModelFieldFactory.createInstance(props.selectedDataModelId, props.newItemNameInput.value);

      const successCallback = () => {
        dispatch(actionUpdatePropertyWithPersist(props.newItemNameInput.id, 'value', ''));

        c.l('gv: ' + props.wizardData.slides.createCollection.gridView.id);

        dispatch(actionUpdatePropertyWithPersist(props.wizardData.slides.createCollection.gridView.id, 'needsToMakeDataRequest', true));
        c.l('needsToMakeDataRequest: ' + props.wizardData.slides.createCollection.gridView.needsToMakeDataRequest);
        dispatch(actionToggleNewItemNameInput(props.newItemNameInput.id));
      };

      const collections = props.wizardData.viewModel.viewModel.children;
      const collection = _.find(collections, (coll) => {
        return coll.viewModel.id === props.wizardData.selectedDataModelId;
      });

      viewModelCreator.create(dispatch, model, collection.id, successCallback);
    }
  };
};


SelectDdlFieldsView = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectDdlFieldsView);

export default SelectDdlFieldsView;

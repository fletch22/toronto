import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import SelectItemOrContainerToolbar from './SelectItemOrContainerToolbar';
import { actionToggleNewItemNameInput, actionSelectDataModel } from '../../../../../actions/wizard/configureDdl/index';
import CreateItemForContainer from './selectCollection/CreateItemForContainer';
import dataModelModelFactory from '../../../../../domain/component/dataModelModelFactory';
import viewModelCreator from '../../../../utils/viewModelCreator';
import { actionUpdatePropertyWithPersist } from '../../../../../actions/index';

class SelectItemOrContainerSlide extends React.Component {

  render() {
    let choices = this.props.viewModel.viewModel.children;

    if (choices.length > 0) {
      choices = choices.map((choice, index) => {
        let classes = 'list-group-item list-group-item-action';

        if (choice.viewModel.id === this.props.selectedDataModelId) {
          classes += ' wiz-sel-coll-selected-collection';
        }

        return (<a href="#" key={index} className={classes} data-value={choice.viewModel.id} onFocus={this.props.onCollectionFocus}>
          {choice.viewModel.label}
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
          <label>Select collection:</label>
          <div className="list-group wiz-sel-coll">
            {
              choices
            }
          </div>
          <div className="sel_view_row_edit_controls">
            <SelectItemOrContainerToolbar onClickAdd={this.props.onClickAddCollection}
              onClickRemove={this.props.onClickRemoveCollection}
              disableButtons={this.props.disableToolbarButtons}
            />
            <div style={{ clear: 'both' }}>
              <CreateItemForContainer
                viewModel={this.props.viewModel}
                newItemNameInput={this.props.newItemNameInput}
                visible={this.props.newCollectionNameInputVisible}
                onClickSave={this.props.onClickSaveCollection}
              />
            </div>
          </div>
        </div>
        <div className="sel_view_row_foot_name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_DDL_FIELDS} disabled={this.props.buttonNextDisabled} label="Next" />
        </div>
      </div>
    );
  }
}

SelectItemOrContainerSlide.propTypes = {
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
  onClickSaveCollection: PropTypes.func
};

const partialFlatten = (ownProps) => {
  const data = ownProps.wizardData;
  const slide = data.slides.selectCollection;
  const newItemNameInput = slide.newItemNameInput;

  return {
    wizardData: ownProps.wizardData,
    viewModel: data.viewModel,
    buttonNextDisabled: slide.buttonNextDisabled,
    selectCollection: slide,
    newItemNameInput,
    newCollectionNameInputVisible: newItemNameInput.visible,
    disableToolbarButtons: newItemNameInput.visible,
    selectedDataModelId: data.selectedDataModelId
  };
};

const mapStateToProps = (state, ownProps) => {
  return partialFlatten(ownProps);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickAddCollection: () => {
      const props = Object.assign({}, ownProps, partialFlatten(ownProps));
      if (!props.disableToolbarButtons) {
        dispatch(actionToggleNewItemNameInput(props.newItemNameInput.id));
      }
    },
    onClickRemoveCollection: () => {
      const flatProps = Object.assign({}, ownProps, partialFlatten(ownProps));
      if (!flatProps.disableToolbarButtons) {
        alert('not yet implemented.');
      }
    },
    onCollectionFocus: (event) => {
      const props = partialFlatten(ownProps);
      const selectedDataModelId = parseInt(event.target.dataset.value, 10);

      c.l(`selectedDataModelId: ${selectedDataModelId}`);

      dispatch(actionSelectDataModel(props.wizardData.id, selectedDataModelId));
    },
    onClickSaveCollection: () => {
      const props = partialFlatten(ownProps);
      const model = dataModelModelFactory.createInstance(props.viewModel.viewModel.id, props.newItemNameInput.value);

      const successCallback = () => {
        dispatch(actionUpdatePropertyWithPersist(props.newItemNameInput.id, 'value', ''));
        dispatch(actionToggleNewItemNameInput(props.newItemNameInput.id));
      };

      viewModelCreator.create(dispatch, model, props.viewModel.id, successCallback);
    }
  };
};

SelectItemOrContainerSlide = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectItemOrContainerSlide);

export default SelectItemOrContainerSlide;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import SelectItemOrContainerToolbar from './selectCollection/toolbar/SelectItemOrContainerToolbar';
import { actionToggleNewItemNameInput, actionSelectCollection } from '../../../../../actions/wizard/configureDdl/index';
import CreateItemForContainer from './selectCollection/CreateItemForContainer';

class SelectItemOrContainerSlide extends React.Component {

  render() {
    let choices = this.props.viewModel.viewModel.children;

    if (choices.length > 0) {
      choices = choices.map((choice, index) => {
        let classes = 'list-group-item list-group-item-action';

        if (choice.viewModel.id === this.props.selectedCollectionId) {
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
          <div className="sel_view_row_edit_controls" style={{ minHeight: '90px' }}>
            <div style={{ height: '50x' }}>
              <SelectItemOrContainerToolbar onClickAdd={this.props.onClickAddCollection}
                onClickRemove={this.props.onClickRemoveCollection}
                disableButtons={this.props.disableToolbarButtons}
              />
              <CreateItemForContainer viewModel={this.props.viewModel} newItemNameInput={this.props.newItemNameInput} visible={this.props.newCollectionNameInputVisible} />
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
  onBlurNewCollectionName: PropTypes.func,
  viewModel: PropTypes.object,
  selectCollectionSlide: PropTypes.object,
  selectedCollectionId: PropTypes.number,
  buttonNextDisabled: PropTypes.bool,
  selectCollection: PropTypes.object,
  newItemNameInput: PropTypes.object,
  newCollectionNameInputVisible: PropTypes.bool,
  disableToolbarButtons: PropTypes.bool,
  onCollectionFocus: PropTypes.func
};

const partialFlatten = (ownProps) => {
  const data = ownProps.wizardData;
  const slide = data.slides.selectCollection;
  const newItemNameInput = slide.newItemNameInput;

  return {
    viewModel: data.viewModel,
    buttonNextDisabled: slide.buttonNextDisabled,
    selectCollection: slide,
    newItemNameInput,
    newCollectionNameInputVisible: newItemNameInput.visible,
    disableToolbarButtons: newItemNameInput.visible,
    selectedCollectionId: slide.selectedCollectionId
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
    onBlurNewCollectionName: () => {
      c.l('Clicked onBlurNewCollectionName...');
    },
    onCollectionFocus: (event) => {
      c.l(event.target.dataset.value);
      const props = partialFlatten(ownProps);

      const selectedCollectionId = parseInt(event.target.dataset.value, 10);
      dispatch(actionSelectCollection(props.selectCollection.id, selectedCollectionId));
    }
  };
};

SelectItemOrContainerSlide = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectItemOrContainerSlide);

export default SelectItemOrContainerSlide;

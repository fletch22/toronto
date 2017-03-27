import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import SelectItemOrContainerToolbar from './selectCollection/toolbar/SelectItemOrContainerToolbar';
import { actionToggleNewItemNameInput } from '../../../../../actions/wizard/configureDdl/index';
import CreateItemForContainer from './selectCollection/CreateItemForContainer';

class SelectItemOrContainerSlide extends React.Component {

  render() {
    let choices = this.props.viewModel.viewModel.children;

    if (choices.length > 0) {
      choices = choices.map((choice, index) => {
        const classes = 'list-group-item list-group-item-action';
        return (<a href="#" key={index} className={classes} data-value={index}>
          {choice.viewModel.label}
        </a>);
      });
    } else {
      choices = (
        <div style={{ padding: '10px 0 0 30px' }}>(no collections)</div>
      );
    }

    return (
      <div className="wizard-config-ddl sel_view_coll-flex">
        <div className="sel_view_row_main">
          <label>Select collection:</label>
          <div className="list-group" style={{ overflowY: 'scroll', maxWidth: '98%', minHeight: '200px', maxHeight: '300px' }}>
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
  buttonNextDisabled: PropTypes.bool,
  selectCollection: PropTypes.object,
  newItemNameInput: PropTypes.object,
  newCollectionNameInputVisible: PropTypes.bool,
  disableToolbarButtons: PropTypes.bool
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
    disableToolbarButtons: newItemNameInput.visible
  };
};

const mapStateToProps = (state, ownProps) => {
  return partialFlatten(ownProps);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickAddCollection: () => {
      const flatProps = Object.assign({}, ownProps, partialFlatten(ownProps));
      if (!flatProps.disableToolbarButtons) {
        dispatch(actionToggleNewItemNameInput(flatProps.newItemNameInput.id));
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
    }
  };
};

SelectItemOrContainerSlide = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectItemOrContainerSlide);

export default SelectItemOrContainerSlide;

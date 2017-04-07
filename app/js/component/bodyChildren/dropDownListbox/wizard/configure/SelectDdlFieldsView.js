import React, { PropTypes } from 'react';
import _ from 'lodash';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import { connect } from 'react-redux';
import SelectItemOrContainerToolbar from './selectCollection/toolbar/SelectItemOrContainerToolbar';
import CreateItemForContainer from './selectCollection/CreateItemForContainer';

class SelectCollectionView extends React.Component {

  // render() {
  //   return (
  //     <div className="wizard-config-ddl">
  //       <div className="wizard-config-ddl col-md-12">
  //         <div className="row" style={{ height: '90%' }}>
  //
  //         </div>
  //         <div className="row text-right">
  //           <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_COLLECTION_VIEW} label="Back" />
  //         </div>
  //       </div>
  //     </div>
  //
  //   );
  // }

  render() {
    c.l('scid: ' + this.props.wizardData.selectedCollectionId);

    let collection = _.find(this.props.viewModel.viewModel.children, (coll) => {
      c.l('cid: ' + coll.viewModel.id);
      return coll.viewModel.id === this.props.wizardData.selectedCollectionId;
    });
    c.lo(collection, 'colls: ');

    let choices = [];

    if (choices.length > 0) {
      choices = choices.map((choice, index) => {
        let classes = 'list-group-item list-group-item-action';

        // if (choice.viewModel.id === this.props.selectedCollectionId) {
        //   classes += ' wiz-sel-coll-selected-collection';
        // }

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
              <CreateItemForContainer viewModel={this.props.viewModel} newItemNameInput={this.props.newItemNameInput} visible={this.props.newItemNameInputVisible} />
            </div>
          </div>
        </div>
        <div className="sel_view_row_foot_name text-right">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_COLLECTION_VIEW} label="Back" />
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_DDL_FIELDS} disabled={this.props.buttonNextDisabled} label="Next" />
        </div>
      </div>
    );
  }
}

SelectCollectionView.propTypes = {
  wizardData: PropTypes.object,
  onClickAddCollection: PropTypes.func,
  onClickRemoveCollection: PropTypes.func,
  onBlurNewCollectionName: PropTypes.func,
  viewModel: PropTypes.object,
  selectContainerFields: PropTypes.object,
  selectedValueFieldId: PropTypes.string,
  selectedTextFieldId: PropTypes.string,
  buttonNextDisabled: PropTypes.bool,
  selectCollection: PropTypes.object,
  newItemNameInput: PropTypes.object,
  newItemNameInputVisible: PropTypes.bool,
  disableToolbarButtons: PropTypes.bool,
  onCollectionFocus: PropTypes.func,
  isSlideActive: PropTypes.bool
};

const partialFlatten = (ownProps) => {
  const data = ownProps.wizardData;
  const slide = data.slides.selectContainerFields;
  const newItemNameInput = slide.newItemNameInput;

  return {
    wizardData: ownProps.wizardData,
    viewModel: data.viewModel,
    buttonNextDisabled: slide.buttonNextDisabled,
    selectContainerFields: slide,
    newItemNameInput,
    newItemNameInputVisible: newItemNameInput.visible,
    disableToolbarButtons: newItemNameInput.visible,
    selectedValueFieldId: slide.selectedValueFieldId,
    selectedTexttFieldId: slide.selectedTexttFieldId
  };
};

const mapStateToProps = (state, ownProps) => {
  const props = partialFlatten(ownProps);
  return props;
};

SelectCollectionView = connect(
  mapStateToProps,
  null
)(SelectCollectionView);

export default SelectCollectionView;

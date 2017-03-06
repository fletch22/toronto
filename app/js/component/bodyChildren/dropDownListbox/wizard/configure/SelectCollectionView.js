import React, { PropTypes } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import WizardPages from './WizardViews';
import ButtonWizard from '../ButtonWizard';
import { DatastoreModelConstants } from '../../../../../domain/component/datastoreModelFactory';
import SelectCollectionToolbar from './selectCollection/toolbar/SelectCollectionToolbar';
import PropTextInput from '../../../../../component/editors/PropTextInput';
import { actionToggleNewCollectionNameInput } from '../../../../../actions/wizard/configureDdl/index';
import CreateCollection from './selectCollection/CreateCollection';

class SelectCollectionSlide extends React.Component {

  render() {
    let choices = this.props.datastore.viewModel.children;

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
              <SelectCollectionToolbar onClickAddCollection={this.props.onClickAddCollection}
                onClickRemoveCollection={this.props.onClickRemoveCollection}
                disableCollectionButtons={this.props.disableCollectionButtons}
              />
              <CreateCollection datastore={this.props.datastore} newCollectionNameInput={this.props.newCollectionNameInput} visible={this.props.newCollectionNameInputVisible} />
            </div>
          </div>
        </div>
        <div className="sel_view_row_foot_name">
          <ButtonWizard wizardId={this.props.wizardData.id} jumpToView={WizardPages.SELECT_DDL_FIELDS} disabled={this.props.buttonNextDisabled} label="Next" />
        </div>
      </div>
    );
  }
}

SelectCollectionSlide.propTypes = {
  wizardData: PropTypes.object,
  onClickAddCollection: PropTypes.func,
  onClickRemoveCollection: PropTypes.func,
  onBlurNewCollectionName: PropTypes.func,
  datastores: PropTypes.array,
  datastore: PropTypes.object,
  selectCollectionSlide: PropTypes.object,
  buttonNextDisabled: PropTypes.bool,
  selectCollection: PropTypes.object,
  newCollectionNameInput: PropTypes.object,
  newCollectionNameInputVisible: PropTypes.bool,
  disableCollectionButtons: PropTypes.bool
};

const partialFlatten = (ownProps) => {
  const data = ownProps.wizardData;
  const slide = data.slides.selectCollection;
  const newCollectionNameInput = slide.newCollectionNameInput;

  return {
    datastores: data.datastores,
    datastore: data.viewModel,
    buttonNextDisabled: slide.buttonNextDisabled,
    selectCollection: slide,
    newCollectionNameInput,
    newCollectionNameInputVisible: newCollectionNameInput.visible,
    disableCollectionButtons: newCollectionNameInput.visible
  };
};

const mapStateToProps = (state, ownProps) => {
  return partialFlatten(ownProps);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickAddCollection: () => {
      const flatProps = Object.assign({}, ownProps, partialFlatten(ownProps));
      if (!flatProps.disableCollectionButtons) {
        dispatch(actionToggleNewCollectionNameInput(flatProps.newCollectionNameInput.id));
      }
    },
    onClickRemoveCollection: () => {
      const flatProps = Object.assign({}, ownProps, partialFlatten(ownProps));
      if (!flatProps.disableCollectionButtons) {
        // dispatch(actionToggleNewCollectionNameInput(flatProps.newCollectionNameInput.id));
      }
    },
    onBlurNewCollectionName: () => {
      c.l('Clicked onBlurNewCollectionName...');
    }
  };
};

SelectCollectionSlide = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectCollectionSlide);

export default SelectCollectionSlide;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import HierNavButtonToolbar from '../../../component/bodyChildren/HierNavButtonToolbar';
import Toolbar from './Toolbar';
import viewModelCreator from '../../../component/utils/viewModelCreator';
import PropPathTextInput from '../../editors/PropPathTextInput';
import { actionShowErrorModal, actionHideCurrentModal, actionUpdateViewPropertyValue } from '../../../actions/index';
import validationUtils from '../../../util/validationUtil';
import Button from '../../../component/bodyChildren/toolbar/Button';
import stateUtil from '../../../util/stateUtil';
import graphTraversal from '../../../state/graphTraversal';
import ComponentTypes from '../../../domain/component/ComponentTypes';

class FullToolbar extends React.Component {
  render() {
    return (
      <div className="bc-toolbar-container">
        <div className="bc-toolbar-col-1">
          <div>
            <div className="bc-toolbar-title-label">
              { this.props.selectedViewModel.viewModel.typeLabel }
            </div>
            <div className="bc-toolbar-description">
              This is a <b>new</b> Div component.
            </div>
          </div>
          <div className="full-toolbar-data flex-normal">
            <Button faClass="fa-cloud-upload" onClick={this.props.onClickSave} tooltipText="Save" disabled={this.props.isSaveButtonDisabled} />
            <Button faClass="fa-undo" onClick={this.props.onClickRevert} tooltipText="Revert" />
          </div>
          <div className="full-toolbar-data flex-normal" style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <label>Flow<br />Direction:</label>
            <div style={{ flexGrow: 1, alignItems: 'flex-end', display: 'flex', justifyContent: 'flex-end' }}>
                <select style={{ flexGrow: 0 }}>
                  <option value="">(select one)</option>
                  <option value="row">row</option>
                  <option value="column">column</option>
                </select>
            </div>
          </div>

        </div>
        <div className="bc-toolbar-col-2">
          <HierNavButtonToolbar selectedChildViewId={this.props.selectedViewModel.id} />
          <Toolbar selectedViewModel={this.props.selectedViewModel} />
        </div>
      </div>
    );
  }
}

//<PropPathTextInput id={this.props.selectedViewModel.id} path="label" value={this.props.label} persistState={false} onBlur={this.props.onBlurName} />

FullToolbar.propTypes = {
  selectedViewModel: PropTypes.object,
  onClickSave: PropTypes.func,
  onClickRevert: PropTypes.func,
  isSaveButtonDisabled: PropTypes.bool,
  elementId: PropTypes.string,
  onBlurName: PropTypes.func,
  label: PropTypes.string
};

FullToolbar.contextTypes = { store: PropTypes.object };

const mapStateToProps = (state, ownProps) => {
  let elementId = ownProps.selectedViewModel.elementId;
  if (elementId === null) {
    elementId = ownProps.selectedViewModel.viewModel.elementId;
  }

  return {
    selectedViewModel: ownProps.selectedViewModel,
    isSaveButtonDisabled: ownProps.selectedViewModel.isSaveButtonDisabled,
    elementId,
    label: ownProps.selectedViewModel.label
  };
};

const isSaveButtonDisabled = (dispatch, ownProps, disabled) => {
  dispatch(actionUpdateViewPropertyValue(ownProps.selectedViewModel.id, 'isSaveButtonDisabled', disabled, true));
};

const updateNameChange = (ownProps, event) => {
  return (dispatch, getState) => {
    const state = getState();

    const viewModel = ownProps.selectedViewModel.viewModel;

    const model = graphTraversal.find(state.model, viewModel.id);

    const webPage = stateUtil.findAncestorByTypeLabel(state.model, model, ComponentTypes.WebPage);

    const isUnique = validationUtils.isUnique(webPage, model, 'elementId', ownProps.selectedViewModel.elementId);
    if (!isUnique) {
      dispatch(actionShowErrorModal('Submit Button Name Error',
        'Encountered an error trying to save the name value. The value in the \'name\' field is not unique within the webpage.',
        actionHideCurrentModal()));
    } else {
      viewModel.elementId = ownProps.selectedViewModel.elementId;
      viewModel.label = ownProps.selectedViewModel.label;

      const successCallback = () => {
        isSaveButtonDisabled(dispatch, ownProps, true);
      };

      viewModelCreator.update(dispatch, ownProps.selectedViewModel, successCallback);
    }
  };
};

const revertChanges = (ownProps, event) => {
  return (dispatch, getState) => {
    const state = getState();

    const selectViewModel = ownProps.selectedViewModel;
    const viewModel = selectViewModel.viewModel;

    const model = graphTraversal.find(state.model, viewModel.id);

    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'elementId', model.elementId, true));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'label', model.label, true));
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onBlurName: () => {
      const viewModel = ownProps.selectedViewModel;

      if (viewModel.elementId !== viewModel.viewModel.elementId || viewModel.label !== viewModel.viewModel.label) {
        isSaveButtonDisabled(dispatch, ownProps, false);
      }
    },
    onClickSave: (event) => {
      dispatch(updateNameChange(ownProps, event));
    },
    onClickRevert: (event) => {
      dispatch(revertChanges(ownProps, event));
    }
  };
};

FullToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullToolbar);


export default FullToolbar;

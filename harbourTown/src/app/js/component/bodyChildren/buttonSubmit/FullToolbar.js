import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import HierNavButtonToolbar from '../../../component/bodyChildren/HierNavButtonToolbar';
import Toolbar from './Toolbar';
import viewModelCreator from '../../../component/utils/viewModelCreator';
import PropPathTextInput from '../../editors/PropPathTextInput';
import { actionShowErrorModal, actionHideCurrentModal, actionUpdateViewPropertyValue } from '../../../actions/index';
import { actionSetPageNeedsSaving } from '../../../actions/bodyChildrenEditor/index';
import validationUtils from '../../../util/validationUtil';
import Button from '../../../component/bodyChildren/toolbar/Button';
import stateUtil from '../../../util/stateUtil';
import graphTraversal from '../../../../../common/state/graphTraversal';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import actionBodyChildSelectorHandler from '../../../reducers/actionBodyChildSelectorHandler';
import _ from 'lodash';

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
              This is a Submit Button component.
            </div>
          </div>
          <div className="full-toolbar-data flex-normal">
            <Button faClass="fa-cloud-upload" onClick={this.props.onClickSave} tooltipText="Save" disabled={!this.props.needsSaving} />
            <Button faClass="fa-undo" onClick={this.props.onClickRevert} tooltipText="Revert" disable={this.props.needsSaving} />
          </div>
          <div className="full-toolbar-data flex-normal">
            <div>
              <label>Name:</label>
            </div>
            <div>
              <PropPathTextInput id={this.props.selectedViewModel.id} path="elementId" value={this.props.elementId} persistState={false} onChangeExternal={this.props.onNameChange} />
            </div>
          </div>
          <div className="full-toolbar-data flex-normal">
            <div>
              <label>Label:</label>
            </div>
            <div>
              <PropPathTextInput id={this.props.selectedViewModel.id} path="label" value={this.props.label} persistState={false} onChangeExternal={this.props.onLabelChange} />
            </div>
          </div>
        </div>
        <div className="bc-toolbar-col-2">
          <HierNavButtonToolbar selectedChildViewId={this.props.selectedViewModel.id} disabled={this.props.needsSaving} />
          <Toolbar selectedViewModel={this.props.selectedViewModel} disabled={this.props.needsSaving} />
        </div>
      </div>
    );
  }
}

FullToolbar.propTypes = {
  selectedViewModel: PropTypes.object,
  onClickSave: PropTypes.func,
  onClickRevert: PropTypes.func,
  isSaveButtonDisabled: PropTypes.bool,
  elementId: PropTypes.string,
  label: PropTypes.string,
  needsSaving: PropTypes.bool,
  onNameChange: PropTypes.func,
  onLabelChange: PropTypes.func
};

FullToolbar.contextTypes = { store: PropTypes.object };

const getIsNeedsSaving = (props) => {
  let result = false;
  const selectedViewModel = props.selectedViewModel;
  const innerViewModel = selectedViewModel.viewModel;

  if (selectedViewModel.elementId !== innerViewModel.elementId
  || selectedViewModel.label !== innerViewModel.label) {
    result = true;
  }
  return result;
};

const mapStateToProps = (state, ownProps) => {
  const elementId = ownProps.selectedViewModel.elementId;
  const label = ownProps.selectedViewModel.label;

  const needsSaving = getIsNeedsSaving(ownProps);

  return {
    selectedViewModel: ownProps.selectedViewModel,
    isSaveButtonDisabled: ownProps.selectedViewModel.isSaveButtonDisabled,
    elementId,
    label,
    needsSaving
  };
};

const isSaveButtonDisabled = (dispatch, ownProps, disabled) => {
  dispatch(actionUpdateViewPropertyValue(ownProps.selectedViewModel.id, 'isSaveButtonDisabled', disabled, true));
};

const save = (ownProps) => {
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

      const setPageDoesNotNeedSaving = (stateThing) => {
        const pageAndSelected = actionBodyChildSelectorHandler.getPageViewModelAndSelectedViewModel(stateThing, ownProps.selectedViewModel.id);
        pageAndSelected.pageViewModel.needsSaving = false;
      };

      viewModelCreator.update(dispatch, ownProps.selectedViewModel, successCallback, setPageDoesNotNeedSaving);
    }
  };
};

const revertChanges = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const selectViewModel = ownProps.selectedViewModel;
    const viewModel = selectViewModel.viewModel;

    const model = graphTraversal.find(state.model, viewModel.id);

    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'elementId', model.elementId, false));
    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'label', model.label, false));
    dispatch(actionSetPageNeedsSaving(selectViewModel.id, false));
  };
};

const nameChange = (ownProps, newElementId) => {
  return (dispatch, getState) => {
    const state = getState();

    let props = _.cloneDeep(ownProps);
    props.selectedViewModel.elementId = newElementId;
    props = mapStateToProps(state, props);

    dispatch(actionSetPageNeedsSaving(props.selectedViewModel.id, props.needsSaving));
  };
};

const labelChange = (ownProps, newLabel) => {
  return (dispatch, getState) => {
    const state = getState();

    let props = _.cloneDeep(ownProps);
    props.selectedViewModel.label = newLabel;
    props = mapStateToProps(state, props);

    dispatch(actionSetPageNeedsSaving(props.selectedViewModel.id, props.needsSaving));
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickSave: () => {
      dispatch(save(ownProps));
    },
    onClickRevert: () => {
      dispatch(revertChanges(ownProps));
    },
    onNameChange: (event) => {
      dispatch(nameChange(ownProps, event.target.value));
    },
    onLabelChange: (event) => {
      dispatch(labelChange(ownProps, event.target.value));
    }
  };
};

FullToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullToolbar);


export default FullToolbar;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import HierNavButtonToolbar from '../../../component/bodyChildren/HierNavButtonToolbar';
import Toolbar from './Toolbar';
import viewModelCreator from '../../../component/utils/viewModelCreator';
import { actionUpdateViewPropertyValue } from '../../../actions/index';
import Button from '../../../component/bodyChildren/toolbar/Button';
import graphTraversal from '../../../state/graphTraversal';

class FullToolbar extends React.Component {
  render() {
    const flowDirection = JSON.parse(this.props.style).flexDirection || '';

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
          <div className="full-toolbar-data flex-bc">
            <label>Flow<br />Direction:</label>
            <div className="flex-bc" style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <select value={flowDirection} style={{ flexGrow: 0 }} onChange={this.props.onSelectFlowDirection}>
                  <option value="">(select one)</option>
                  <option value="row">horizontal</option>
                  <option value="column">vertical</option>
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

FullToolbar.propTypes = {
  selectedViewModel: PropTypes.object,
  onClickSave: PropTypes.func,
  onClickRevert: PropTypes.func,
  isSaveButtonDisabled: PropTypes.bool,
  elementId: PropTypes.string,
  onBlurName: PropTypes.func,
  label: PropTypes.string,
  onSelectFlowDirection: PropTypes.func,
  style: PropTypes.string
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
    label: ownProps.selectedViewModel.label,
    style: ownProps.selectedViewModel.viewModel.style
  };
};

const isSaveButtonDisabled = (dispatch, ownProps, disabled) => {
  dispatch(actionUpdateViewPropertyValue(ownProps.selectedViewModel.id, 'isSaveButtonDisabled', disabled, true));
};

const update = (ownProps) => {
  return (dispatch) => {
    const successCallback = () => {
      isSaveButtonDisabled(dispatch, ownProps, true);
    };

    viewModelCreator.update(dispatch, ownProps.selectedViewModel, successCallback);
  };
};


const revertChanges = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const selectViewModel = ownProps.selectedViewModel;
    const viewModel = selectViewModel.viewModel;

    const model = graphTraversal.find(state.model, viewModel.id);

    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'viewModel.style', model.style, true));
  };
};

const selectFlowDirection = (ownProps, event) => {
  return (dispatch) => {
    const selectViewModel = ownProps.selectedViewModel;
    const viewModel = selectViewModel.viewModel;

    const styleString = viewModel.style;
    const style = JSON.parse(styleString);

    style.flexDirection = event.target.value;

    dispatch(actionUpdateViewPropertyValue(selectViewModel.id, 'viewModel.style', JSON.stringify(style), true));
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
      dispatch(update(ownProps, event));
    },
    onClickRevert: (event) => {
      dispatch(revertChanges(ownProps, event));
    },
    onSelectFlowDirection: (event) => {
      dispatch(selectFlowDirection(ownProps, event));
    }
  };
};

FullToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullToolbar);


export default FullToolbar;

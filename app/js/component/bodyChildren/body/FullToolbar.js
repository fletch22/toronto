import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import HierNavButtonToolbar from '../../../component/bodyChildren/HierNavButtonToolbar';
import Toolbar from './Toolbar';
import viewModelCreator from '../../../component/utils/viewModelCreator';
import PropPathTextInput from '../../../component/editors/PropPathTextInput';
import { actionSetPageNeedsSaving } from '../../../actions/bodyChildrenEditor/index';
import _ from 'lodash';
import Button from '../toolbar/Button';
import actionBodyChildSelectorHandler from '../../../reducers/actionBodyChildSelectorHandler';

class FullToolbar extends React.Component {
  render() {
    const flowDirection = (!!this.props.style && JSON.parse(this.props.style).flexDirection) || '';

    return (
      <div className="bc-toolbar-container">
        <div className="bc-toolbar-col-1">
          <div>
            <div className="bc-toolbar-title-label">
              { this.props.selectedViewModel.viewModel.typeLabel }
            </div>
            <div className="bc-toolbar-description">
              This is a <b>new</b> Body component.
            </div>
          </div>
          <div className="full-toolbar-data flex-bc">
            <div className="flex-bc" style={{ alignItems: 'center', justifyContent: 'flex-start', paddingTop: '25px' }}>
              <div>
                <label>Page Name:</label>
              </div>
              <PropPathTextInput
                id={this.props.selectedViewModel.id}
                path={'pageName'}
                value={this.props.pageName}
                persistState={false} onChangeExternal={this.props.onPageNameChange}
                classNames=""
              />
              <Button faClass="fa-cloud-upload" onClick={this.props.onClickSavePageName} tooltipText="Save" disabled={!this.props.needsSaving} />
            </div>
          </div>
          <div className="full-toolbar-data flex-bc">
            <label>Flow Direction:</label>
            <div className="flex-bc" style={{ alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                <select value={flowDirection} style={{ flexGrow: 0 }} onChange={this.props.onSelectFlowDirection}>
                  <option value="" readOnly>(select one)</option>
                  <option value="row" readOnly>horizontal</option>
                  <option value="column" readOnly>vertical</option>
                </select>
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
  id: PropTypes.string,
  pageName: PropTypes.string,
  selectedViewModel: PropTypes.object,
  onSelectFlowDirection: PropTypes.func,
  style: PropTypes.string,
  onPageNameChange: PropTypes.func,
  needsSaving: PropTypes.bool,
  onClickSavePageName: PropTypes.func
};

const getIsNeedsSaving = (props) => {
  let result = false;
  const selectedViewModel = props.selectedViewModel;
  const innerViewModel = selectedViewModel.viewModel;

  if (selectedViewModel.pageName !== innerViewModel.pageName) {
    result = true;
  }
  return result;
};

const mapStateToProps = (state, ownProps) => {
  const needsSaving = getIsNeedsSaving(ownProps);
  const pageName = ownProps.selectedViewModel.pageName;

  const selectedViewModel = (ownProps.selectedViewModel) ? ownProps.selectedViewModel : ownProps;

  return {
    selectedViewModel,
    style: ownProps.selectedViewModel.style,
    needsSaving,
    pageName
  };
};

const selectFlowDirection = (ownProps, event) => {
  return (dispatch) => {
    const selectViewModel = ownProps.selectedViewModel;
    const viewModel = selectViewModel.viewModel;

    let styleString = viewModel.style;
    const style = JSON.parse(styleString) || {};

    style.flexDirection = event.target.value;

    styleString = JSON.stringify(style);
    viewModel.style = styleString;

    viewModelCreator.update(dispatch, selectViewModel);
  };
};

const clickSavePageName = (ownProps) => {
  return (dispatch) => {
    const selectViewModel = ownProps.selectedViewModel;
    const viewModel = selectViewModel.viewModel;

    viewModel.pageName = selectViewModel.pageName;

    const setPageDoesNotNeedSaving = (stateThing) => {
      const pageAndSelected = actionBodyChildSelectorHandler.getPageViewModelAndSelectedViewModel(stateThing, ownProps.selectedViewModel.id);
      pageAndSelected.pageViewModel.needsSaving = false;
    };

    viewModelCreator.update(dispatch, selectViewModel, undefined, setPageDoesNotNeedSaving);
  };
};

const pageNameChange = (ownProps, newLabel) => {
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
    onSelectFlowDirection: (event) => {
      dispatch(selectFlowDirection(ownProps, event));
    },
    onPageNameChange: (event) => {
      dispatch(pageNameChange(ownProps, event.target.value));
    },
    onClickSavePageName: () => {
      dispatch(clickSavePageName(ownProps));
    }
  };
};

FullToolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(FullToolbar);


export default FullToolbar;

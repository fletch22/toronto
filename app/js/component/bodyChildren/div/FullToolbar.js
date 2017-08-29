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
          <div className="full-toolbar-data flex-bc">
            <label>Flow<br />Direction:</label>
            <div className="flex-bc" style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <select value={flowDirection} style={{ flexGrow: 0 }} onChange={this.props.onSelectFlowDirection}>
                  <option value="" readOnly>(select one)</option>
                  <option value="row" readOnly>horizontal</option>
                  <option value="column" readOnly>vertical</option>
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
  onSelectFlowDirection: PropTypes.func,
  style: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  return {
    style: ownProps.selectedViewModel.viewModel.style
  };
};

const selectFlowDirection = (ownProps, event) => {
  return (dispatch) => {
    const selectViewModel = ownProps.selectedViewModel;
    const viewModel = selectViewModel.viewModel;

    let styleString = viewModel.style;
    const style = JSON.parse(styleString);

    style.flexDirection = event.target.value;

    styleString = JSON.stringify(style);
    viewModel.style = styleString;

    viewModelCreator.update(dispatch, selectViewModel);
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
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

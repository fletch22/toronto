import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import layoutModelFactory from '../../../domain/component/layoutModelFactory';
import actionComponentCreator from '../../../reducers/actionComponentCreator';
import bodyChildrenCreator from '../../../component/editors/bodyChildren/bodyChildrenCreator';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';

class Toolbar extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa-object-group" onClick={this.props.createLayout} tooltipText="Create Layout" />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedChildViewId: PropTypes.any,
  selectedChildModelId: PropTypes.any,
  createLayout: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createLayout: () => {
      const model = layoutModelFactory.createInstance(ownProps.selectedChildModelId);
      const viewModel = actionComponentCreator.generateViewModel(ownProps.selectedChildViewId, model);

      const successCallback = () => {
        dispatch(actionSetCurrentBodyTool(viewModel.id));
      };

      bodyChildrenCreator.createUpdate(dispatch, ownProps.selectedChildViewId, viewModel, successCallback);
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

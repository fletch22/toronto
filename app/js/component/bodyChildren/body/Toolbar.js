import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import layoutModelFactory from '../../../domain/component/layoutModelFactory';
import actionComponentCreator from '../../../reducers/actionComponentCreator';
import bodyChildrenCreator from '../../../component/editors/bodyChildren/bodyChildrenCreator';
import layoutService from '../../../service/component/layoutService';

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
      bodyChildrenCreator.createUpdate(dispatch, ownProps.selectedChildViewId, viewModel, layoutService.createOrUpdate);
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';

class Toolbar extends React.Component {

  render() {
    return (
      <div>
        <Button faClass="fa-reddit-square" onClick={this.props.createLayout}  />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedChildViewId: PropTypes.any,
  createLayout: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  // const parent = graphTraversal.find(state, ownProps.id);
  // const stateChildren = parent.viewModel.children;
  // const propsChildren = ownProps.viewModel.children;
  //
  // let children = stateChildren;
  // if (!util.doArrayElementsMatchIdentities(propsChildren, stateChildren)) {
  //   children = [].concat(stateChildren);
  // }
  //
  // let typeLabel;
  // const selectedChildViewId = parent.selectedChildViewId;
  // if (selectedChildViewId) {
  //   const viewModel = graphTraversal.find(state, selectedChildViewId);
  //   typeLabel = viewModel.viewModel.typeLabel;
  // }
  //
  // return {
  //   children,
  //   selectedChildViewId,
  //   typeLabel
  // };

  return {};
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createLayout: () => {
      // const parentViewModel = Object.assign({}, ownProps);
      // const model = layoutModelFactory.createInstance(ownProps.viewModel.id);
      // const viewModel = actionComponentCreator.generateViewModel(ownProps.id, model);
      //
      // bodyChildrenCreator.createUpdate(dispatch, parentViewModel, viewModel, layoutService.createOrUpdate);
    }
  };
};

Toolbar = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

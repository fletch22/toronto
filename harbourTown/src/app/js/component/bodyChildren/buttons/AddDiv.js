import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import bodyChildrenCreatorService from '../../../service/bodyChildrenCreatorService';
import graphTraversal from '../../../../../common/state/graphTraversal';
import divModelFactory from '../../../domain/component/divModelFactory';

class AddDiv extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa-square-o" onClick={this.props.addDiv} tooltipText="Add Div" disabled={this.props.disabled} />
      </div>
    );
  }
}

AddDiv.propTypes = {
  viewModel: PropTypes.object,
  addDiv: PropTypes.func,
  disabled: PropTypes.bool
};

const addDiv = (parentModelId, viewModelId, modelFactory) => {
  return (dispatch, getState) => {
    const state = getState();
    const parentModel = graphTraversal.find(state.model, parentModelId);

    const model = modelFactory.createInstance({ parentId: parentModelId, ordinal: String(parentModel.children.length) });

    bodyChildrenCreatorService.create(dispatch, model, viewModelId);
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addDiv: () => {
      dispatch(addDiv(ownProps.viewModel.viewModel.id, ownProps.viewModel.id, divModelFactory));
    }
  };
};


AddDiv = connect(
  null,
  mapDispatchToProps
)(AddDiv);

export default AddDiv;

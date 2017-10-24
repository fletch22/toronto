import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import bodyChildrenCreatorService from '../../../service/bodyChildrenCreatorService';
import buttonSubmitModelFactory from '../../../domain/component/buttonSubmitModelFactory';
import stateUtil from '../../../util/stateUtil';
import ComponentTypes from '../../../domain/component/ComponentTypes';
import graphTraversal from "../../../state/graphTraversal";

class AddButtonSubmit extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa-subway" onClick={this.props.onClick} tooltipText="Add Submit Button" />
      </div>
    );
  }
}

AddButtonSubmit.propTypes = {
  viewModel: PropTypes.object,
  onClick: PropTypes.func
};

const addButtonSubmit = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const nameUnique = stateUtil.getUniquePropertyValue(state, 'elementId', ComponentTypes.ButtonSubmit);

    const parentViewModel = graphTraversal.find(state, ownProps.viewModel.id);

    const model = buttonSubmitModelFactory.createInstance(ownProps.viewModel.viewModel.id, nameUnique, 'Submit', String(parentViewModel.viewModel.children.length));
    bodyChildrenCreatorService.create(dispatch, model, ownProps.viewModel.id);
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(addButtonSubmit(ownProps));
    }
  };
};


AddButtonSubmit = connect(
  null,
  mapDispatchToProps
)(AddButtonSubmit);

export default AddButtonSubmit;

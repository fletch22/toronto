import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import bodyChildrenCreatorService from '../../../service/bodyChildrenCreatorService';
import ddlModelFactory from '../../../domain/component/ddlModelFactory';
import ddlModelUtils from '../../../domain/component/ddlModelUtils';
import graphTraversal from '../../../state/graphTraversal';

class AddDropDownListbox extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa-list-alt" onClick={this.props.onClick} tooltipText="Add Select" />
      </div>
    );
  }
}

AddDropDownListbox.propTypes = {
  viewModel: PropTypes.object,
  onClick: PropTypes.func
};

const createDdl = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    const nameUnique = ddlModelUtils.getUniqueDdlName(state);

    const parentViewModel = graphTraversal.find(state, ownProps.viewModel.id);

    const model = ddlModelFactory.createInstance(ownProps.viewModel.viewModel.id, nameUnique, null, null, null, null, String(parentViewModel.viewModel.children.length));
    bodyChildrenCreatorService.create(dispatch, model, ownProps.viewModel.id);
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(createDdl(ownProps));
    }
  };
};


AddDropDownListbox = connect(
  null,
  mapDispatchToProps
)(AddDropDownListbox);

export default AddDropDownListbox;

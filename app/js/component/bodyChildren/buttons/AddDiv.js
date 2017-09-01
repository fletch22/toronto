import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import ComponentTypes from '../../../domain/component/ComponentTypes';
import bodyChildrenCreatorService from '../../../service/bodyChildrenCreatorService';
import modelGenerator from '../../../domain/component/modelGenerator';

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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addDiv: () => {
      const model = modelGenerator.generate(ownProps.viewModel.viewModel.id, ComponentTypes.Div);
      bodyChildrenCreatorService.create(dispatch, model, ownProps.viewModel.id);
    }
  };
};


AddDiv = connect(
  null,
  mapDispatchToProps
)(AddDiv);

export default AddDiv;

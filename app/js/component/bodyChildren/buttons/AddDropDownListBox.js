import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import bodyChildrenCreatorService from '../../../service/bodyChildrenCreatorService';
import ddlModelFactory from '../../../domain/component/ddlModelFactory';

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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      const model = ddlModelFactory.createInstance(ownProps.viewModel.viewModel.id, 'Foo', null, null, null, null);
      bodyChildrenCreatorService.create(dispatch, model, ownProps.viewModel.id);
    }
  };
};


AddDropDownListbox = connect(
  null,
  mapDispatchToProps
)(AddDropDownListbox);

export default AddDropDownListbox;

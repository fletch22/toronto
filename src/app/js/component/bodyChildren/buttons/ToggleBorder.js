import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import bodyChildrenCreatorService from '../../../service/bodyChildrenCreatorService';

class ToggleBorder extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa-pencil-square-o" onClick={this.props.toggle} tooltipText="Toggle Border" />
      </div>
    );
  }
}

ToggleBorder.propTypes = {
  viewModel: PropTypes.object,
  toggle: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    toggle: () => {
      const newProps = Object({}, ownProps);
      newProps.viewModel.viewModel.style = JSON.stringify({ border: '1px solid red', padding: '0', margin: '0', width: '100%' });
      bodyChildrenCreatorService.update(dispatch, ownProps.viewModel, newProps.viewModel.parentId);
    }
  };
};


ToggleBorder = connect(
  null,
  mapDispatchToProps
)(ToggleBorder);

export default ToggleBorder;

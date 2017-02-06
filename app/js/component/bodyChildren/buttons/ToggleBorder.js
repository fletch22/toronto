import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import viewModelCreator from '../../utils/viewModelCreator';
import modelGenerator from '../../../domain/component/modelGenerator';
// import { actionToggleBorder } from '../../../actions/bodyChildrenEditor/index';

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
      // dispatch(actionToggleBorder(ownProps.viewModel.id));
      // const model = modelGenerator.generate(ownProps.viewModel.viewModel.id, ComponentTypes.Layout);
      // ownProps.viewModel.viewModel.
      ownProps.viewModel.viewModel.style = JSON.stringify({ border: '1px solid red', padding: '0', margin: '0', width: '100%' });
      viewModelCreator.update(dispatch, ownProps.viewModel, ownProps.viewModel.parentId);
    }
  };
};


ToggleBorder = connect(
  null,
  mapDispatchToProps
)(ToggleBorder);

export default ToggleBorder;

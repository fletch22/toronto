import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import ComponentTypes from '../../../domain/component/ComponentTypes';
import viewModelCreator from '../../utils/viewModelCreator';
import modelGenerator from '../../../domain/component/modelGenerator';

class ButtonDiv extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa-square-o" onClick={this.props.addDiv} tooltipText="Add Div" />
      </div>
    );
  }
}

ButtonDiv.propTypes = {
  viewModel: PropTypes.object,
  addDiv: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addDiv: () => {
      const model = modelGenerator.generate(ownProps.viewModel.viewModel.id, ComponentTypes.Div);
      viewModelCreator.create(dispatch, model, ownProps.viewModel.id);
    }
  };
};


ButtonDiv = connect(
  null,
  mapDispatchToProps
)(ButtonDiv);

export default ButtonDiv;

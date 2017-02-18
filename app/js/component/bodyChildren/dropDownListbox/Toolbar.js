import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import ComponentTypes from '../../../domain/component/ComponentTypes';
import viewModelCreator from '../../utils/viewModelCreator';
import modelGenerator from '../../../domain/component/modelGenerator';

class Toolbar extends React.Component {

  render() {
    return (
      <div>

      </div>
    );
  }
}

Toolbar.propTypes = {
  onClick: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      // const model = modelGenerator.generate(ownProps.viewModel.viewModel.parentId, ComponentTypes.DropDownListbox);
      // viewModelCreator.create(dispatch, model, ownProps.viewModel.id);
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

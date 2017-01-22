import React, { PropTypes } from 'react';
import ComponentTypes from '../../domain/component/ComponentTypes';
import GridLayout from './GridLayout';

class BodyChildrenGenerator extends React.Component {

  render() {
    let component;
    switch (this.props.viewModel.viewModel.typeLabel) {
      case ComponentTypes.Layout: {
        component = <GridLayout { ... this.props } />;
        break;
      }
      default: {
        console.log('Encountered problem while trying to determine view name for pseudo modal.');
        break;
      }
    }

    return (
      component
    );
  }
}

BodyChildrenGenerator.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.object
};

export default BodyChildrenGenerator;

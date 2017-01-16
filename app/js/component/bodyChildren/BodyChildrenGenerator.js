import React, { PropTypes } from 'react';
import ComponentTypes from '../../domain/component/ComponentTypes';
import GridLayout from './GridLayout';

class BodyChildrenGenerator extends React.Component {

  render() {
    let component = <div>banana</div>;
    switch (this.props.viewModel.viewModel.typeLabel) {
      case ComponentTypes.Layout: {
        component = <GridLayout id={123} pageChildren={[]} />;
        break;
      }
      default: {
        console.log('Encountered problem while trying to determine view name for pseudo modal.');
        break;
      }
    }

    console.log(JSON.stringify(this.props.viewModel));

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

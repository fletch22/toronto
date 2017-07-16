import React, { PropTypes } from 'react';
import dimensions from 'react-dimensions';
import SvgRoot from './SvgRoot';

class SvgContainer extends React.Component {

  render() {
    return (
      <div>
        <SvgRoot data={this.props.data} height={this.props.containerHeight} width={this.props.containerWidth} size={[500, 500]} />
      </div>
    );
  }
}

SvgContainer.propTypes = {
  data: PropTypes.object,
  containerHeight: PropTypes.any,
  containerWidth: PropTypes.any
};

export default dimensions()(SvgContainer);

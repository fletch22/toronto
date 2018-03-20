import React, { PropTypes } from 'react';
import SvgComponent from '../SvgComponent';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';


class Cylinder extends SvgComponent {

  constructor() {
    super();
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this)).style('cursor', 'move');
  }

  render() {
    const transform = `scale(1) translate(${this.props.offset}, 0)`;
    return (
      <g transform={transform} ref="rootGroup" onMouseOver={this.onMouseOver}>
        <ellipse cx="25" cy="25" rx="25" ry="10" fill={this.props.color} />
        <rect x="0" y="25" width="50" height="50" fill={this.props.color} />
        <ellipse cx="25" cy="75" rx="25" ry="10" fill={this.props.color} />
      </g>
    );
  }
}

Cylinder.propTypes = {
  ...SvgComponent.propTypes,
  onClick: PropTypes.func,
  color: PropTypes.string,
  offset: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  return { ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps) };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    onClick: (event) => {
      event.stopPropagation();
      c.l('Got cylinder click event!');
    }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};

Cylinder = connect(
  mapStateToProps,
  mapDispatchToProps
)(Cylinder);


export default Cylinder;

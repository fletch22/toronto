import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';

class DnText extends React.Component {

  constructor() {
    super();
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this.refs.rootGroup)).style('cursor', 'pointer');
  }

  render() {
    return (
      <g ref="rootGroup">
        <text ref={this.props.refLinkName} x={this.props.x} y={this.props.y} fill="black" onClick={this.props.onClick} onMouseOver={this.onMouseOver}>{this.props.label}</text>
      </g>
    );
  }
}

DnText.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  refLinkName: PropTypes.string
};


export default DnText;

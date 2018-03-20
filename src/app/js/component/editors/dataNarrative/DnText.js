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
        <text x="4" y="28" font-family="sans-serif" font-size="20px" fill="white" onClick={this.props.onClick} onMouseOver={this.onMouseOver}>AAA{this.props.label}</text>
      </g>
    );
  }
}

DnText.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.string
};


export default DnText;

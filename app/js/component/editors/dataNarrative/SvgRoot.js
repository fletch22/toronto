import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { zoom } from 'd3-zoom';
import { select, event } from 'd3-selection';
import d3 from 'd3';
import SvgRootVisualization from './SvgRootVisualization';

class SvgRoot extends React.Component {

  constructor(props) {
    super(props);
    this.addRect = this.addRect.bind(this);
    this.zoomed = this.zoomed.bind(this);
  }

  componentDidMount() {
    this.d3Node = select(ReactDOM.findDOMNode(this));
    this.d3Node.call(zoom().on('zoom', this.zoomed));

    this.rootGroupNode = select(ReactDOM.findDOMNode(this.refs.rootGroup));
    this.rootGroupNode.datum(this.props.data)
      .call(SvgRootVisualization.enter);

    this.addRect();
  }

  componentDidUpdate() {

  }

  zoomed() {
    const svg = select(ReactDOM.findDOMNode(this.refs.rootGroup));
    svg.attr('transform', event.transform);
  }

  addRect() {
    const rootGroupNode = ReactDOM.findDOMNode(this.refs.rootGroup);

    select(rootGroupNode)
    .append('rect')
      .attr('width', '300')
      .attr('height', '300')
      .attr('x', 0)
      .attr('y', 0)
      .style('fill', 'steelblue');
  }

  render() {
    return (
      <svg width={this.props.width} height={this.props.height} style={{ border: "1px solid red" }}>
          <g ref="rootGroup"></g>
      </svg>
    );
  }
}

SvgRoot.propTypes = {
  data: PropTypes.object,
  size: PropTypes.array,
  height: PropTypes.any,
  width: PropTypes.any
};

const mapStateToProps = (state, ownProps) => {
  return {
    data: ownProps.data,
    size: ownProps.size,
    height: ownProps.height,
    width: ownProps.width
  };
};

SvgRoot = connect(
  mapStateToProps,
  null
)(SvgRoot);


export default SvgRoot;

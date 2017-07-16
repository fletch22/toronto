import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { zoom } from 'd3-zoom';
// import d3 from 'd3';
import { select, event } from 'd3-selection';

class BarChart extends React.Component {

  // constructor(props) {
  //   super(props);
  //   this.createBarChart = this.createBarChart.bind(this);
  // }
  //
  // componentDidMount() {
  //   this.createBarChart();
  // }
  //
  // componentDidUpdate() {
  //   this.createBarChart();
  // }

  // createBarChart() {
  //
  //   const self = this;
  //   const zoomed = () => {
  //     c.l('calling zooned.');
  //     ReactDOM.findDOMNode(self).attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
  //   };
  //
  //   const zoomFn = zoom()
  //     .scaleExtent([1, 10])
  //     .on('zoom', zoomed);
  //
  //   c.l('CREATE CALLED');
  //   const data = [5, 10, 1, 3];
  //
  //   const node = this.refs.svg;
  //   const dataMax = max(data);
  //   const yScale = scaleLinear()
  //     .domain([0, dataMax])
  //     .range([0, this.props.size[1]]);
  //   select(node)
  //     .selectAll('rect')
  //     .data(data)
  //     .enter()
  //     .append('rect');
  //
  //   select(node)
  //     .selectAll('rect')
  //     .data(data)
  //     .exit()
  //     .remove();
  //
  //   select(node)
  //     .selectAll('rect')
  //     .data(data)
  //     .style('fill', '#fe9922')
  //     .attr('x', (d, i) => i * 25)
  //     .attr('y', d => this.props.size[1] - yScale(d))
  //     .attr('height', d => yScale(d))
  //     .attr('width', 25)
  //     .call(zoomFn);
  // }

  constructor(props) {
    super(props);
    this.selectSvgRef = this.selectSvgRef.bind(this);
    this.zoomed = this.zoomed.bind(this);
  }

  zoomed() {
    console.log(event);
  }

  selectSvgRef(ref) {
    const svg = select(ref);

    svg.append('rect')
      .attr('width', 300)
      .attr('height', 300)
      .style('pointer-events', 'all')
      .style('fill', 'steelblue')
      .call(zoom().on('zoom', this.zoomed));
  }

  render() {
    return (
        <svg ref={this.selectSvgRef} width={500} height={500}>
        </svg>
    );
  }
}

BarChart.propTypes = {
  data: PropTypes.object,
  size: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  c.lo(ownProps.data, 'data: ');

  return {
    data: ownProps.data,
    size: ownProps.size
  };
};

BarChart = connect(
  mapStateToProps,
  null
)(BarChart);


export default BarChart;

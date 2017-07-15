import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { select } from 'd3-selection';

class BarChart extends React.Component {

  constructor(props) {
    super(props);
    this.createBarChart = this.createBarChart.bind(this);
  }

  componentDidMount() {
    this.createBarChart();
  }

  componentDidUpdate() {
    this.createBarChart();
  }

  createBarChart() {
    c.l('CREATE CALLED');
    const data = [5, 10, 1, 3];

    const node = this.refs.svg;
    const dataMax = max(data);
    const yScale = scaleLinear()
      .domain([0, dataMax])
      .range([0, this.props.size[1]]);
    select(node)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect');

    select(node)
      .selectAll('rect')
      .data(data)
      .exit()
      .remove();

    select(node)
      .selectAll('rect')
      .data(data)
      .style('fill', '#fe9922')
      .attr('x', (d, i) => i * 25)
      .attr('y', d => this.props.size[1] - yScale(d))
      .attr('height', d => yScale(d))
      .attr('width', 25);
  }

  render() {
    return (
        <svg ref="svg" width={500} height={500}>
        </svg>
    );
  }
}

BarChart.propTypes = {
  data: PropTypes.object,
  size: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  return {
    size: ownProps.size
  };
};

BarChart = connect(
  mapStateToProps,
  null
)(BarChart);


export default BarChart;

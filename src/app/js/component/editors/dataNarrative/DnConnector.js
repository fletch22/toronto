import React, { PropTypes } from 'react';
import SvgComponent from './SvgComponent';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { actionUpdateViewPropertyValue } from '../../../actions';
import { actionSetDataNarrativeConnectorAfterDrag } from '../../../actions/bodyChildrenEditor/index';
import { actionSetDataNarrativeViewProps } from '../../../actions/bodyChildrenEditor';
import ReactDOM from "react-dom";
import DnConnectorInNexus from "./DnConnectorInNexus";
import stringUtils from '../../../../../common/util/stringUtils';

class DnConnector extends React.Component {

  componentDidMount() {
    const props = this.props;

    const domNode = ReactDOM.findDOMNode(this.refs.rootGroup);
    const g = d3.select(domNode);
    // const outConnectorSelection = d3.select(`#${props.parentId}`);

    g.on('mousedown', () => {
      c.l(`MouseDown X: ${d3.event.x}`);

      d3.event.preventDefault();
      d3.event.stopPropagation();

      g.on('mousemove', () => {
        d3.event.preventDefault();
        d3.event.stopPropagation();
      });
    });

    this.drawConnector(g, props);
  }

  componentDidUpdate() {
    const props = this.props;

    const domNode = ReactDOM.findDOMNode(this.refs.rootGroup);
    const g = d3.select(domNode);

    this.drawConnector(g, props);
  }

  getScreenLocation(node) {
    let coords = {
      x: 0,
      y: 0
    };

    if (node.getBoundingClientRect) {
      const rect = node.getBoundingClientRect();
      coords = {
        x: rect.x,
        y: rect.y
      };

      c.lo(coords, 'coord-middle: ');

      if (node.parentNode) {
        const outerCoords = this.getScreenLocation(node.parentNode);
        if (outerCoords) {
          coords = {
            x: coords.x - outerCoords.x,
            y: coords.y - outerCoords.y
          };
        }
      }
    }

    return coords;
  }

  drawConnector(gSelection, props) {
    gSelection.selectAll('path').remove();

    const triangleSymbol = d3.symbol().type(d3.symbolTriangle);

    const connectorInNexusId = props.viewModel.connectorInNexusId;
    const inNexusDomNode = document.getElementById(connectorInNexusId);
    // const inNexusDomNode = document.getElementById(props.parentId);

    const inNexusRect = inNexusDomNode.getBoundingClientRect();

    const outNexusDomNode = document.getElementById(props.parentId);
    // const outNexusRect = outNexusDomNode.getBoundingClientRect();

    // c.lo(inNexusRect, 'inNexusRect: ');
    // c.lo(outNexusRect, 'outNexusRect: ');

    const mySVG = document.getElementById('svgRoot');
    const pnt = mySVG.createSVGPoint();
    pnt.x = inNexusRect.x;
    pnt.y = inNexusRect.y;

    const SCTM = outNexusDomNode.getScreenCTM();
    const iPNT = pnt.matrixTransform(SCTM.inverse());

    // c.lo(rectMySvg, 'mySVG: ');
    // c.l(`iPNT.x: ${iPNT.x}; iPNT.y: ${iPNT.y}`);

    // if (iPNT) {
    gSelection.append('path')
      .attr('d', triangleSymbol)
      .attr('fill', 'Yellow')
      .attr('stroke', 'black')
      .attr('transform', `translate(${iPNT.x}, ${iPNT.y})`);
    // }

    // let rect = outNexusDomNode.getBoundingClientRect();
    // const coordinates = this.getScreenLocation(outNexusDomNode.parentNode);
    // c.lo(coordinates, 'coordinates: ');
    //
    // c.lo(this.offset(outNexusDomNode), 'offset: ');
  }
  //
  // offset(el) {
  //   const rect = el.getBoundingClientRect();
  //   const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  //   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  //   return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  // }

  render() {
    return (
      <g ref="rootGroup">
      </g>
    );
  }
}

DnConnector.propTypes = {
  id: PropTypes.number,
  parentId: PropTypes.string,
  viewModel: PropTypes.object,
  onClick: PropTypes.func,
  dataNarrativeView: PropTypes.object,
  onMouseOverConnector: PropTypes.object,
  data: PropTypes.object,
  test: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
  c.l('Did fire mapStateToProps...');
  // c.lo(ownProps.data);

  return {
    ...ownProps,
    test: new Date().getMilliseconds()
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {};
};

DnConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnConnector);


export default DnConnector;

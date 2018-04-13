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
    const domNode = ReactDOM.findDOMNode(this.refs.rootGroup);
    const g = d3.select(domNode);

    g.on('mousedown', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();

      g.on('mousemove', () => {
        d3.event.preventDefault();
        d3.event.stopPropagation();
      });
    });
  }

  getConnectorForReact() {
    const triangleSymbol = d3.symbol().type(d3.symbolTriangle);

    const connectorInNexusId = this.props.viewModel.connectorInNexusId;
    const inNexusDomNode = document.getElementById(connectorInNexusId);

    if (inNexusDomNode) {
      const outNexusDomNode = document.getElementById(this.props.parentId);
      const destinationCoord = this.translateRelativeToNode(inNexusDomNode, outNexusDomNode);

      const radiusOrigin = parseInt(outNexusDomNode.getAttribute('r'), 10);

      const originCoord = this.translateRelativeToNode(outNexusDomNode, outNexusDomNode);
      const originOffsetCoord = {
        x: originCoord.x + radiusOrigin,
        y: originCoord.y + radiusOrigin
      };

      const radiusDest = parseInt(inNexusDomNode.getAttribute('r'), 10);
      const destinationOffsetCoord = {
        x: destinationCoord.x - radiusDest,
        y: destinationCoord.y + radiusDest
      };

      const slope = (originOffsetCoord.y - destinationOffsetCoord.y) / (originOffsetCoord.x - destinationOffsetCoord.x);
      let rotationAngle = Math.atan(slope) * (180 / Math.PI) - 30;

      if ((originCoord.x > destinationOffsetCoord.x)) {
        rotationAngle += 180;
      } else if (originCoord.x === destinationOffsetCoord.x) {
        // rotationAngle += 180;
      }

      return (
        <g>
          <line x1={originOffsetCoord.x} y1={originOffsetCoord.y} x2={destinationOffsetCoord.x} y2={destinationOffsetCoord.y} stroke="Cornflowerblue" strokeWidth="4" />
          <path d={`${triangleSymbol()}`} fill="Cornflowerblue" stroke="Cornflowerblue" transform={`translate(${destinationOffsetCoord.x}, ${destinationOffsetCoord.y}) rotate(${rotationAngle}) scale(1.4)`} />
        </g>
      );
    }

    return null;
  }

  translateRelativeToNode(inNexusDomNode, outNexusDomNode) {
    const inNexusRect = inNexusDomNode.getBoundingClientRect();

    const mySVG = document.getElementById('svgRoot');
    const pnt = mySVG.createSVGPoint();
    pnt.x = inNexusRect.x;
    pnt.y = inNexusRect.y;

    const SCTM = outNexusDomNode.getScreenCTM();
    return pnt.matrixTransform(SCTM.inverse());
  }

  render() {
    const connector = this.getConnectorForReact();

    return (
      <g ref="rootGroup">
        {
          connector
        }
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

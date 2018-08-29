import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import { actionDoNothing } from '../../../../actions/index';
import stateTraversal from '../../../../../../common/state/stateTraversal';
import graphTraversal from '../../../../../../common/state/graphTraversal';
import ComponentTypes from '../../../../../../common/domain/component/ComponentTypes';
import DnComponentDealer from '../DnComponentDealer';
import SvgUtil from '../SvgUtil';
import dnConnectorUtils from '../dnConnector/dnConnectorUtils';
import DnTransferCase from '../DnTransferCase';

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

    this.props.postRender();
  }

  getConnectorForReact() {
    const triangleSymbol = d3.symbol().type(d3.symbolTriangle);

    const inNexusDomNode = document.getElementById(this.props.connectorInNexusId);

    const result = {
      connector: null,
      lineInfo: null
    };

    if (inNexusDomNode) {
      const lineInfo = this.getLine(inNexusDomNode);

      result.lineInfo = lineInfo;
      result.connector = (
        <g>
          <line id={this.props.id}
            x1={lineInfo.originOffsetCoord.x}
            y1={lineInfo.originOffsetCoord.y}
            x2={lineInfo.destinationOffsetCoord.x}
            y2={lineInfo.destinationOffsetCoord.y}
            stroke={dnConnectorUtils.mainBodyColor}
            strokeWidth="4"
          />
          <path d={`${triangleSymbol()}`}
            fill={dnConnectorUtils.mainBodyColor}
            stroke={dnConnectorUtils.mainBodyColor}
            transform={`translate(${lineInfo.destinationOffsetCoord.x}, ${lineInfo.destinationOffsetCoord.y}) rotate(${lineInfo.rotationAngle}) scale(1.4)`}
          />
        </g>
      );
    }

    return result;
  }

  getLine(inNexusDomNode) {
    const outNexusDomNode = document.getElementById(this.props.parentId);
    const destinationCoord = SvgUtil.translateRelativeToNode(inNexusDomNode, outNexusDomNode);

    const radiusOrigin = parseInt(outNexusDomNode.getAttribute('r'), 10);

    const originCoord = SvgUtil.translateRelativeToNode(outNexusDomNode, outNexusDomNode);
    const originOffsetCoord = {
      x: originCoord.x + radiusOrigin,
      y: originCoord.y + radiusOrigin
    };

    const radiusDest = parseInt(inNexusDomNode.getAttribute('r'), 10);
    const destinationOffsetCoord = {
      x: destinationCoord.x - radiusDest,
      y: destinationCoord.y + radiusDest
    };

    let rotationAngle = this.getHeadRotation(originOffsetCoord, destinationOffsetCoord);

    if ((originOffsetCoord.x > destinationOffsetCoord.x)) {
      rotationAngle += 180;
    }

    return {
      originOffsetCoord,
      destinationOffsetCoord,
      rotationAngle
    };
  }

  getHeadRotation(originOffsetCoord, destinationOffsetCoord) {
    const slope = (originOffsetCoord.y - destinationOffsetCoord.y) / (originOffsetCoord.x - destinationOffsetCoord.x);
    return Math.atan(slope) * (180 / Math.PI) - 30;
  }

  render() {
    const result = this.getConnectorForReact();
    const connector = result.connector;
    const coordinates = result.lineInfo;

    // c.lo(this.props.viewModel, `viewModel: `);

    return (
      <g ref="rootGroup">
        {
          connector
        }
        {
           this.props.children.map((child) => {
             if (!!coordinates) {
               child.coordinates = {
                 tail: coordinates.originOffsetCoord,
                 head: coordinates.destinationOffsetCoord
               };
             }

             return (
               <DnComponentDealer key={child.id} data={child} dataNarrativeView={this.props.dataNarrativeView} />
             );
           })
        }
      </g>
    );
  }
}

DnConnector.propTypes = {
  id: PropTypes.any,
  parentId: PropTypes.string,
  viewModel: PropTypes.object,
  onClick: PropTypes.func,
  dataNarrativeView: PropTypes.object,
  onMouseOverConnector: PropTypes.object,
  data: PropTypes.object,
  postRender: PropTypes.func,
  connectorInNexusId: PropTypes.string,
  children: PropTypes.array
};


const findViewIdFromModelId = (state, viewId, modelId) => {
  const node = graphTraversal.find(state, viewId);

  let id;
  if (node) {
    const dataNarrative = stateTraversal.findAncestorViewWithModelTypeLabel(state, node, ComponentTypes.DataNarrative);
    const view = stateTraversal.findDescendantViewWithModelId(dataNarrative, modelId);
    id = view.id;
  }

  return id;
};

const mapStateToProps = (state, ownProps) => {
  const viewModel = ownProps.data.viewModel;
  const viewCoordinates = { ...viewModel.viewCoordinates };

  let connectorInNexusId;
  if (viewModel.connectorInNexusId) {
    connectorInNexusId = findViewIdFromModelId(state, ownProps.data.id, viewModel.connectorInNexusId);
  }

  const children = viewModel.children || [];

  return {
    ...ownProps,
    viewModel,
    viewCoordinates,
    connectorInNexusId,
    children
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    postRender: () => {
      dispatch(actionDoNothing());
    }
  };
};


DnConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnConnector);


export default DnConnector;

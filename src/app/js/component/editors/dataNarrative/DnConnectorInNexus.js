import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgComponent from './SvgComponent';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import viewModelCreator from '../../../component/utils/viewModelCreator';
import stateTraversal from '../../../../../common/state/stateTraversal';
import dnConnectorModelFactory from '../../../domain/component/dataNarrative/dnConnectorModelFactory';
import DnComponentDealer from './DnComponentDealer';

class DnConnectorInNexus extends React.Component {

  static renderConnectingHover(domNode) {
    d3.select(domNode).attr('fill', 'LightBlue').attr('stroke', 'CornflowerBlue').attr('r', '10');
  }

  static renderConnectingDeHover(domNode) {
    d3.select(domNode).attr('fill', 'CornflowerBlue').attr('stroke', null).attr('r', '5');
  }

  constructor(props) {
    super(props);
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this.refs.container)).style('cursor', 'pointer');
  }

  render() {
    return (
      <g ref="container" onMouseOver={this.onMouseOver}>
        <circle id={this.props.id} className="dnConnectorInNexus" ref="connector" cx={this.props.viewModel.viewCoordinates.x} cy={this.props.viewModel.viewCoordinates.y} r="5" fill="CornflowerBlue"
          onClick={this.props.onClick} onMouseOver={this.props.onMouseOverConnector}
        />
      </g>
    );
  }
}

DnConnectorInNexus.contextTypes = { store: PropTypes.object };

DnConnectorInNexus.propTypes = {
  ...SvgComponent.propTypes,
  id: PropTypes.number,
  dataNarrativeView: PropTypes.object,
  onMouseUpConnector: PropTypes.func,
  onMouseOverConnector: PropTypes.func,
  children: PropTypes.array,
  connectorX: PropTypes.number,
  connectorY: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  onClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  // c.lo(ownProps, 'ownProps: ');
  const children = !!ownProps.data.viewModel.children ? ownProps.data.viewModel.children : [];

  return { ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps),
    children
  };
};

const onMouseUpConnector = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    c.l('Got to mouse up connector.');

    // const viewCoordinates = { x: 100 - 20, y: 39 - 10 };
    // const protoModel = { id: stateTraversal.getNextId(state), parentId: ownProps.viewModel.id, viewCoordinates };
    //
    // const model = dnConnectorModelFactory.createInstance(protoModel);
    //
    // return viewModelCreator.create(dispatch, model, ownProps.id);
  };
};

const onMouseOverConnector = (ownProps) => {
  return (dispatch, getState) => {
    const state = getState();

    c.l('Got to mouse over connector.');

    // const viewCoordinates = { x: 100 - 20, y: 39 - 10 };
    // const protoModel = { id: stateTraversal.getNextId(state), parentId: ownProps.viewModel.id, viewCoordinates };
    //
    // const model = dnConnectorModelFactory.createInstance(protoModel);
    //
    // return viewModelCreator.create(dispatch, model, ownProps.id);
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    onMouseUpConnector: () => {
      dispatch(onMouseUpConnector(ownProps));
    },
    onMouseOverConnector: () => {
      dispatch(onMouseOverConnector(ownProps));
    },
    onClick: () => {
      c.l('onclick!');
      // dispatch(onMouseUpConnector(ownProps));
    }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};


DnConnectorInNexus = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnConnectorInNexus);


export default DnConnectorInNexus;

import React, { PropTypes } from 'react';
import SvgComponent from './SvgComponent';
import { connect } from 'react-redux';
import dataStoreModelUtils from '../../../../../common/domain/component/dataStoreModelUtils';
import ReactDOM from 'react-dom';
import graphTraversal from '../../../../../common/state/graphTraversal';
import ActionInvoker from '../../../actions/ActionInvoker';
import * as d3 from 'd3';
import dataStoreImage from '../../../../images/database-generic.svg';

class DnDataStore extends SvgComponent {

  constructor() {
    super();
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this.refs.rootGroup)).style('cursor', 'move');
  }

  afterMount(dom) {
    const group = d3.select(ReactDOM.findDOMNode(this.refs.rootGroup)); // this.links.exit().remove();
    group.selectAll('*').remove();

    group.append('svg:image')
      .attr('xlink:href', dataStoreImage)
      .attr('transform', 'scale(.2)');

    group.append('text')
      .attr('font-family', 'sans-serif').attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('alignment-baseline', 'alphabetic')
      .attr('y', 63).attr('x', 41)
      .text(this.props.label);
  }

  afterUpdate(dom) {
    this.afterMount(dom);
  }

  render() {
    return (
      <g ref="rootGroup" onMouseOver={this.onMouseOver}>

      </g>
    );
  }
}

DnDataStore.propTypes = {
  ...SvgComponent.propTypes,
  id: PropTypes.number,
  label: PropTypes.string,
  onClick: PropTypes.func,
  dataNarrativeView: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const defaultDataStore = dataStoreModelUtils.getDefaultDataStoreByState(state);

  return { ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps),
    label: defaultDataStore.label
  };
};

const onClick = (actionStatePackage, args) => {
  const stateNew = actionStatePackage.stateNew;

  const event = args.event;

  const dataNarrativeView = args.dataNarrativeView;

  const viewModel = graphTraversal.find(stateNew, dataNarrativeView.id);

  viewModel.collectionMenu = {
    position: {
      x: event.clientX,
      y: event.clientY
    },
    display: true,
    children: []
  };

  return stateNew;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    onClick: (event) => {
      ActionInvoker.invoke(dispatch, onClick, { ...ownProps, event });
    }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};

DnDataStore = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnDataStore);


export default DnDataStore;


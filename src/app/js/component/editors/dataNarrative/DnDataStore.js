import React, { PropTypes } from 'react';
import SvgComponent from './SvgComponent';
import { connect } from 'react-redux';
import dataStoreModelUtils from '../../../../../common/domain/component/dataStoreModelUtils';
import DnText from './DnText';
import ReactDOM from 'react-dom';
import graphTraversal from '../../../../../common/state/graphTraversal';
import ActionInvoker from '../../../actions/ActionInvoker';
import * as d3 from 'd3';

class DnDataStore extends SvgComponent {

  constructor() {
    super();
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this.refs.rootGroup)).style('cursor', 'move');
  }

  render() {
    return (
      <g transform="scale(1.5)" ref="rootGroup" onMouseOver={this.onMouseOver}>
        <ellipse cx="25" cy="0" rx="25" ry="10" fill="purple" />
        <rect x="0" y="0" width="50" height="50" fill="purple" />
        <ellipse cx="25" cy="50" rx="25" ry="10" fill="purple" />
        <DnText label={this.props.label} onClick={this.props.onClick} />
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

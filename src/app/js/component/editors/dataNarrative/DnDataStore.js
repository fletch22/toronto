import React, { PropTypes } from 'react';
import SvgComponent from './SvgComponent';
import { connect } from 'react-redux';
import dataStoreModelUtils from '../../../../../common/domain/component/dataStoreModelUtils';
import ReactDOM from 'react-dom';
import graphTraversal from '../../../../../common/state/graphTraversal';
import ActionInvoker from '../../../actions/ActionInvoker';
import * as d3 from 'd3';
import dataStoreImage from '../../../../images/database-generic.svg';
import DnComponentDealer from './DnComponentDealer';

class DnDataStore extends SvgComponent {

  constructor() {
    super();
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this.refs.rootGroup)).style('cursor', 'move');
  }

  render() {
    const children = this.props.viewModel.children || [];

    return (
      <g ref="rootGroup" onMouseOver={this.onMouseOver}>
        <image xlinkHref={dataStoreImage} transform="scale(.2)" />
        <text fontFamily="sans-serif" fill="white" textAnchor="middle" alignmentBaseline="alphabetic" x="41" y="63">{this.props.label}</text>
        {
          children.map((child) => (
            <DnComponentDealer key={child.id} {...child} data={child} dataNarrativeView={this.props.dataNarrativeView} />
          ))
        }
      </g>
    );
  }
}

DnDataStore.propTypes = {
  ...SvgComponent.propTypes,
  id: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  dataNarrativeView: PropTypes.object,
  viewModel: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  const defaultDataStore = dataStoreModelUtils.getDefaultDataStoreByState(state);

  return { ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps),
    label: defaultDataStore.label,
    viewModel: ownProps.data.viewModel
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


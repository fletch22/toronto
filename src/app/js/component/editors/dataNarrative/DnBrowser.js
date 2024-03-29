import React, { PropTypes } from 'react';
import SvgComponent from './SvgComponent';
import { connect } from 'react-redux';
import dataStoreModelUtils from '../../../../../common/domain/component/dataStoreModelUtils';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import DnComponentDealer from './DnComponentDealer';
import DnConnectorNexus from './DnConnectorOutNexus';

class DnBrowser extends SvgComponent {

  constructor() {
    super();
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  onMouseOver() {
    d3.select(ReactDOM.findDOMNode(this.refs.rootGroup)).style('cursor', 'move');
  }

  render() {
    const children = this.props.data.viewModel.children || [];

    return (
      <g ref="rootGroup" onMouseOver={this.onMouseOver}>
        <rect rx="6" x="0" y="0" width="100" height="75" fill="gray" />
        <text ref="label" fontFamily="sans-serif" fill="white" textAnchor="middle" alignmentBaseline="alphabetic" x="51" y="42">Browser</text>
        {
          children.map((child) => (
            <DnComponentDealer key={child.id} {...child} data={child} dataNarrativeView={this.props.dataNarrativeView} />
          ))
        }
      </g>
    );
  }
}

DnBrowser.propTypes = {
  ...SvgComponent.propTypes,
  id: PropTypes.any,
  onClick: PropTypes.func,
  dataNarrativeView: PropTypes.object,
  onMouseOverConnector: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const defaultDataStore = dataStoreModelUtils.getDefaultDataStoreByState(state);

  return { ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps),
    label: defaultDataStore.label
  };
};

const onMouseOverConnector = (ownProps, newSelection, propertyName) => {
  return (dispatch, getState) => {
    // const state = getState();
    //
    // const mergedProps = _.cloneDeep(ownProps);
    // mergedProps.selectedViewModel[propertyName] = newSelection;
    //
    // const props = mapStateToProps(state, mergedProps);

    // ActionInvoker.invoke(dispatch, stateUpdateSelectChange, { viewId: ownProps.selectedViewModel.id, propertyName, newValue: newSelection, needsSaving: props.needsSaving });
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    onMouseOverConnector: (event) => {
      const value = event.target.dataset.id;
      dispatch(onMouseOverConnector());
    }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};

DnBrowser = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnBrowser);


export default DnBrowser;

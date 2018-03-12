import React, { PropTypes } from 'react';
import SvgComponent from './SvgComponent';
import { connect } from 'react-redux';
import dataStoreModelUtils from '../../../../../common/domain/component/dataStoreModelUtils';
import DnText from './DnText';
import { select } from 'd3-selection';
import ReactDOM from 'react-dom';
import graphTraversal from "../../../../../common/state/graphTraversal";
import ActionInvoker from "../../../actions/ActionInvoker";

class DnDataStore extends SvgComponent {

  constructor() {
    super();
    this.onMouseOver = this.onMouseOver.bind(this);
  }

  onMouseOver() {
    select(ReactDOM.findDOMNode(this.refs.rootGroup)).style('cursor', 'move');
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
  dataModelDisplay: PropTypes.bool
};

const mapStateToProps = (state, ownProps) => {
  const defaultDataStore = dataStoreModelUtils.getDefaultDataStoreByState(state);

  c.lo(ownProps, 'ownProps: ');

  return { ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps),
    label: defaultDataStore.label
  };
};

const onClick = (actionStatePackage, ownProps) => {
  const stateNew = actionStatePackage.stateNew;

  const viewModel = graphTraversal.find(stateNew, ownProps.id);

  c.lo(viewModel, 'viewModel: ');

  viewModel.dataModelDisplay = true;

  return stateNew;
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
    onClick: () => {
      ActionInvoker.invoke(dispatch, onClick, ownProps);
    }
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};

DnDataStore = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnDataStore);


export default DnDataStore;

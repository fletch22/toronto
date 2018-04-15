import React, { PropTypes } from 'react';
import SvgComponent from './SvgComponent';
import { connect } from 'react-redux';
import dataStoreModelUtils from '../../../../../common/domain/component/dataStoreModelUtils';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import webServer from '../../../../images/webServer2.svg';
import DnComponentDealer from './DnComponentDealer';

class DnWebServer extends SvgComponent {

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
        <image xlinkHref={webServer} transform="scale(.2)" />
        <text fontFamily="sans-serif" fill="gray" textAnchor="middle" alignmentBaseline="alphabetic" x="84" y="45">Web Server</text>
        {
          children.map((child) => (
            <DnComponentDealer {...child} data={child} dataNarrativeView={this.props.dataNarrativeView} />
          ))
        }
      </g>
    );
  }
}

DnWebServer.propTypes = {
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

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {
  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};

DnWebServer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnWebServer);


export default DnWebServer;

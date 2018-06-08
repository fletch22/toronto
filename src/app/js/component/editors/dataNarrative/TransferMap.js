import dnConnectorUtils from 'app/js/component/editors/dataNarrative/dnConnector/dnConnectorUtils';
import React, { PropTypes } from 'react';
import Button from 'app/js/component/Button';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import DnTransferCase from 'app/js/component/editors/dataNarrative/DnTransferCase';
import { connect } from 'react-redux';
import ActionInvoker from 'app/js/actions/ActionInvoker';
import SvgUtil from 'app/js/component/editors/dataNarrative/SvgUtil';
import SvgButtonClose from './SvgButtonClose';
import { actionDoNothing } from 'app/js/actions/index';

const width = 100;
const height = 150;

class TransferMap extends React.Component {

  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this.refs.rootGroup);
    const g = d3.select(domNode);

    g.on('click', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
    });

    g.on('dblclick', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
    });

    this.props.postRender();
  }

  getTransformation() {
    return {
      x: this.props.coords.x - (width / 2),
      y: this.props.coords.y - (height / 2)
    };
  }

  render() {
    const nodeNeedingMap = ReactDOM.findDOMNode(this.refs.rootGroup);
    let transform;
    let coords;
    if (nodeNeedingMap) {
      coords = {
        x: this.props.coords.x - (width / 2),
        y: this.props.coords.y - (height / 2)
      };
      transform = `translate(${coords.x}, ${coords.y})`;
    }

    return (
      <g ref="rootGroup">
        <rect rx="6" width={width} height={height} fill={dnConnectorUtils.mainBodyColor} transform={transform} />
        <SvgButtonClose parentWidth={width} coords={coords} onCloseButtonClick={this.props.onClickClose} />
      </g>
    );
  }
}

TransferMap.propTypes = {
  id: PropTypes.number,
  parentId: PropTypes.string,
  viewModel: PropTypes.object,
  data: PropTypes.object,
  coords: PropTypes.object,
  onClickClose: PropTypes.func,
  postRender: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    postRender: () => {
      c.l('tm dn...');
      dispatch(actionDoNothing());
    }
  };
};

// const mapStateToProps = (state, ownProps) => {
//   c.lo(ownProps.coords, 'coords: ');
//
//   const coords = {
//     x: ownProps.coords.x - (width / 2),
//     y: ownProps.coords.y - (height / 2)
//   };
//
//   return {
//     coords
//   };
// };

TransferMap = connect(
  null,
  mapDispatchToProps
)(TransferMap);

export default TransferMap;

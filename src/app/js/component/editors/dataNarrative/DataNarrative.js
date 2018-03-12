import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import SvgContainer from './SvgContainer';
import Button from '../../bodyChildren/toolbar/Button';
import { actionUpdateViewPropertyValue } from '../../../actions/index';

class DataNarrative extends React.Component {
  render() {
    return (
      <div className="flex-normal" style={{ height: '100%' }}>
        <div>
          <div className="flex-vertical data-narrative-button-menu">
            <Button faClass="fa fa-plus " onClick={this.props.onClickZoomIn} tooltipText="Zoom In" />
            <Button faClass="fa fa-minus " onClick={this.props.onClickZoomOut} tooltipText="Zoom Out" />
          </div>
        </div>
        <div style={{ width: '100%', height: '100%' }}>
          <SvgContainer data={this.props.data} />
        </div>
      </div>
    );
  }
}

DataNarrative.propTypes = {
  id: PropTypes.any,
  data: PropTypes.object,
  onCancelClick: PropTypes.func,
  onClickZoomIn: PropTypes.func,
  onClickZoomOut: PropTypes.func,
  zoom: PropTypes.number
};

const transformProps = (props) => {
  return {
    id: props.id,
    data: props.data,
    zoom: props.data.zoom
  };
};

const mapStateToProps = (state, ownProps) => {
  return transformProps(ownProps);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickZoomIn: (event) => {
      const props = transformProps(ownProps);
      dispatch(actionUpdateViewPropertyValue(props.data.id, 'zoom', props.zoom * 1.1, true));
    },
    onClickZoomOut: (event) => {
      const props = transformProps(ownProps);
      dispatch(actionUpdateViewPropertyValue(props.data.id, 'zoom', props.zoom * 0.9, true));
    }
  };
};

DataNarrative = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataNarrative);

export default DataNarrative;

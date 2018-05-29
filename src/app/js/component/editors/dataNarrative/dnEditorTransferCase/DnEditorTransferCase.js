import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import DnEditorMasterSvgContainer from '../DnEditorMasterSvgContainer';
import Button from '../../../bodyChildren/toolbar/Button';
// import { actionUpdateViewPropertyValue } from '../../../../actions/index';
import DnEditorTransferCaseSvgRoot from '../dnEditorTransferCase/DnEditorTransferCaseSvgRoot';

class DnEditorTransferCase extends React.Component {
  render() {
    return (
      <div className="flex-normal" style={{ height: '100%', marginTop: '2px' }}>
        <div>
          <div className="flex-vertical data-narrative-button-menu" style={{ width: '30px' }}>
          </div>
        </div>
        <div style={{ width: '100%', height: '100%' }}>
          <DnEditorTransferCaseSvgRoot data={this.props.data} height={this.props.containerHeight} width={this.props.containerWidth} size={[500, 500]} />
        </div>
      </div>
    );
  }
}

DnEditorTransferCase.propTypes = {
  id: PropTypes.any,
  data: PropTypes.object,
  onCancelClick: PropTypes.func,
  onClickZoomIn: PropTypes.func,
  onClickZoomOut: PropTypes.func,
  containerHeight: PropTypes.any,
  containerWidth: PropTypes.any,
  zoom: PropTypes.number
};

const transformProps = (props) => {
  return {
    id: props.id,
    data: props.data,
    zoom: props.data.viewModel.zoom
  };
};

const mapStateToProps = (state, ownProps) => {
  return transformProps(ownProps);
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // onClickZoomIn: (event) => {
    //   const props = transformProps(ownProps);
    //   // dispatch(actionUpdateViewPropertyValue(props.data.id, 'zoom', props.zoom * 1.1, true));
    // },
    // onClickZoomOut: (event) => {
    //   const props = transformProps(ownProps);
    //   // dispatch(actionUpdateViewPropertyValue(props.data.id, 'zoom', props.zoom * 0.9, true));
    // }
  };
};

DnEditorTransferCase = connect(
  mapStateToProps,
  mapDispatchToProps
)(DnEditorTransferCase);

export default DnEditorTransferCase;

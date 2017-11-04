import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

class DropMarker extends React.Component {

  render() {
    let classNames = 'pricetag';
    classNames = this.props.visible ? classNames : `display-none ${classNames}`;

    let offsetLeft = 0;
    let offsetTop = 0;

    if (this.props.visible) {
      // c.l(`classNames: ${classNames}`);
      // c.l(`pos: ${this.props.position}`);
      // c.l(`isvl: ${this.props.isVerticalLayout}`);
      const markerOffsetY = 60;
      if (this.props.isVerticalLayout) {
        switch (this.props.position) {
          case 'before':
            offsetLeft = this.props.rectX - 15;
            offsetTop = this.props.rectY - markerOffsetY;
            break;
          case 'middle': {
            if (!!this.props.lastChildViewModelId) {
              const dom = window.document.getElementById(this.props.lastChildViewModelId);
              const lastChildBoundingRect = dom.getBoundingClientRect();
              offsetLeft = lastChildBoundingRect.x - 15;
              offsetTop = lastChildBoundingRect.y + lastChildBoundingRect.height - 60;
            } else {
              offsetLeft = this.props.rectX - 5;
              offsetTop = this.props.rectY - (this.props.rectHeight / 2);
            }
            break;
          }
          case 'after':
            offsetLeft = this.props.rectX - 15;
            offsetTop = this.props.rectY + this.props.rectHeight - markerOffsetY;
            break;
          case null:
            break;
          default: {
            throw new Error(`Encountered error trying to handle position. Position ${this.props.position} not recognized.`);
          }
        }
      } else {
        switch (this.props.position) {
          case 'before':
            offsetLeft = this.props.rectX - 19;
            offsetTop = this.props.rectY - markerOffsetY;
            break;
          case 'middle': {
            if (!this.props.lastChildViewModelId) {
              offsetLeft = this.props.rectX - 5;
              offsetTop = this.props.rectY - markerOffsetY + 10;
            } else {
              const dom = window.document.getElementById(this.props.lastChildViewModelId);
              const hoverBoundingRect = dom.getBoundingClientRect();
              offsetLeft = hoverBoundingRect.x + hoverBoundingRect.width - 19;
              offsetTop = hoverBoundingRect.y - markerOffsetY;
            }
            break;
          }
          case 'after':
            offsetLeft = this.props.rectX + this.props.rectWidth - 19;
            offsetTop = this.props.rectY - markerOffsetY;
            break;
          case null:
            break;
          default: {
            throw new Error(`Encountered error trying to handle position. Position ${this.props.position} not recognized.`);
          }
        }
      }
    }
    return (
      <span className={classNames} style={{ left: `${offsetLeft}px`, top: `${offsetTop}px` }}>
        Insertion Point
      </span>
    );
  }
}

DropMarker.propTypes = {
  ownerId: PropTypes.string,
  hoveringId: PropTypes.string,
  visible: PropTypes.bool,
  position: PropTypes.string,
  rectWidth: PropTypes.number,
  rectHeight: PropTypes.number,
  rectX: PropTypes.number,
  rectY: PropTypes.number,
  lastChildViewModelId: PropTypes.string,
  isVerticalLayout: PropTypes.bool
};

const mapStateToProps = (state, props) => {
  const dnd = state.dragNDrop;

  const visible = (dnd.hoverOverId === props.ownerId);
  let position = null;

  // c.l(`hoid: ${dnd.hoverOverId}`);
  // c.l(`ownerId: ${props.ownerId}`);

  const measurements = dnd.measurements;

  // if (visible) {
  //   c.lo(measurements, 'measurements: ');
  // }

  let rectWidth = 0;
  let rectHeight = 0;
  let rectX = 0.0;
  let rectY = 0.0;
  let isVerticalLayout;
  if (visible && measurements && measurements.hoverBoundingRect) {
    const rect = measurements.hoverBoundingRect;
    rectWidth = rect.width;
    rectHeight = rect.height;
    position = measurements.position;
    rectX = rect.x;
    rectY = rect.y;
    // c.lo(measurements, 'measurements: ');
    isVerticalLayout = measurements.isVerticalLayout;
  }

  const lastChildViewModelId = dnd.lastChildViewModelId;

  return {
    visible,
    position,
    rectWidth,
    rectHeight,
    rectX,
    rectY,
    lastChildViewModelId,
    isVerticalLayout
  };
};

DropMarker = connect(
  mapStateToProps,
  null
)(DropMarker);

export default DropMarker;

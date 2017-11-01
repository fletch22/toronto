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
      if (this.props.isVerticalLayout) {
        switch (this.props.position) {
          case 'before':
            offsetLeft = this.props.rectX - 15;
            offsetTop = this.props.rectY - (this.props.rectHeight / 2) - 20;
            break;
          case 'middle': {
            if (!!this.props.lastChildViewModelId) {
              const dom = window.document.getElementById(this.props.lastChildViewModelId);
              const hoverBoundingRect = dom.getBoundingClientRect();
              offsetLeft = hoverBoundingRect.x - 20;
              offsetTop = hoverBoundingRect.y + (hoverBoundingRect.height);
            } else {
              offsetLeft = this.props.rectX - 5;
              offsetTop = this.props.rectY - (this.props.rectHeight / 2);
            }
            break;
          }
          case 'after':
            offsetLeft = (this.props.rectX + this.props.rectWidth) - 15;
            offsetTop = this.props.rectY - (this.props.rectHeight / 2) - 20;
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
            offsetLeft = this.props.rectX - 15;
            offsetTop = this.props.rectY - (this.props.rectHeight / 2) - 20;
            break;
          case 'middle': {
            if (this.props.lastChildViewModelId === null) {
              offsetLeft = this.props.rectX - 5;
              offsetTop = this.props.rectY - (this.props.rectHeight / 2);
            } else {
              const dom = window.document.getElementById(this.props.lastChildViewModelId);
              const hoverBoundingRect = dom.getBoundingClientRect();
              offsetLeft = hoverBoundingRect.x + (hoverBoundingRect.width / 2) + 15;
              offsetTop = hoverBoundingRect.y - (hoverBoundingRect.height / 2) - 20;
            }
            break;
          }
          case 'after':
            offsetLeft = (this.props.rectX + this.props.rectWidth) - 15;
            offsetTop = this.props.rectY - (this.props.rectHeight / 2) - 20;
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

  const measurements = dnd.measurements;

  let rectWidth = 0;
  let rectHeight = 0;
  let rectX = 0.0;
  let rectY = 0.0;
  let isVerticalLayout;
  if (measurements && measurements.hoverBoundingRect) {
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

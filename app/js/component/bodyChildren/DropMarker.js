import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class DropMarker extends React.Component {

  render() {
    let classNames = 'pricetag';
    classNames = this.props.visible ? classNames : `display-none ${classNames}`;

    const left = !!this.props.offsetLeft ? this.props.offsetLeft : 0;
    const top = !!this.props.offsetTop ? this.props.offsetTop : 0;

    return (
      <span className={classNames} style={{ left: `${left}px`, top: `${top}px` }}>
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
  offsetLeft: PropTypes.number,
  offsetTop: PropTypes.number
};

const mapStateToProps = (state, props) => {
  const dnd = state.dragNDrop;

  const visible = (dnd.hoverOverId === props.ownerId);
  const position = dnd.position;

  let offsetLeft = 0;
  let offsetTop = 0;
  const measurements = dnd.measurements;
  if (measurements && measurements.hoverBoundingRect) {
    const rect = measurements.hoverBoundingRect;

    if (measurements.position === 'before') {
      offsetLeft = - 15;
    } else {
      offsetLeft = rect.width - 15;
    }
    offsetTop = -((rect.height / 2) + 20);
  }

  return {
    visible,
    position,
    offsetLeft,
    offsetTop
  };
};

DropMarker = connect(
  mapStateToProps,
  null
)(DropMarker);

export default DropMarker;

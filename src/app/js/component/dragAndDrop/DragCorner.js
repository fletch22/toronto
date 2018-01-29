import React, { PropTypes } from 'react';
import { connect as reduxConnect } from 'react-redux';
import DragAndDropMaker from '../dragAndDrop/DragAndDropMaker';
import DropMarker from '../../component/bodyChildren/DropMarker';
import DragAndDropUtils from './DragAndDropUtils';
import f22Uuid from '../../../../common/util/f22Uuid';

/* eslint-disable react/prefer-stateless-function */
class DragCorner extends React.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  render() {
    return DragAndDropMaker.connectDragAndDropRender(this.props, (
      <div id={f22Uuid.generate()} style={{ position: 'absolute', top: '-12px', left: this.props.dragCornerOffsetX, width: '10px', height: '10px', backgroundColor: 'yellow', border: '1px solid red' }}>
        <DropMarker ownerId={this.props.id} />
      </div>
    ));
  }
}

DragCorner.propTypes = {
  id: PropTypes.string,
  dragCornerOffsetX: PropTypes.number,
  clazz: PropTypes.string,
  selectedElementId: PropTypes.string,
  move: PropTypes.func,
  cancelDrag: PropTypes.func
};

DragCorner = DragAndDropMaker.connectDragAndDrop(DragCorner);

DragCorner = reduxConnect(
  null,
  DragAndDropUtils.mapDispatchToProps
)(DragCorner);

export default DragCorner;

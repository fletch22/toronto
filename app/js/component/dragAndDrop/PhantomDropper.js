import React, { PropTypes } from 'react';
import BodyChild from '../bodyChildren/BodyChild';
import DragAndDropMaker from '../dragAndDrop/DragAndDropMaker';

class PhantomDropper extends BodyChild {
  render() {
    const height = '125px';
    const width = '100%';

    return DragAndDropMaker.connectRender(this.props, (
      <div style={{ border: ' 12.5px solid red', height }}>
      </div>
    ));
  }
}

PhantomDropper.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  viewModel: PropTypes.object
};

PhantomDropper = DragAndDropMaker.connect(PhantomDropper);

export default PhantomDropper;

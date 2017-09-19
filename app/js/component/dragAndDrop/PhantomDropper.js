import React, { PropTypes } from 'react';
import BodyChild from '../bodyChildren/BodyChild';

class PhantomDropper extends BodyChild {
  render() {
    const height = `${this.props.height}px`;
    const width = `${this.props.width}px`;
    return (
      <div style={{ border: '2px solid red', height, width }}>
        test
      </div>
    );
  }
}

PhantomDropper.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number
};

export default PhantomDropper;

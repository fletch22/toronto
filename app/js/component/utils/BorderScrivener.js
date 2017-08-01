import React, { PropTypes } from 'react';

class BorderScrivener extends React.Component {
  render() {

    const topOffsetWidth = 3;
    const topStyle = {
      top: `${this.props.top - topOffsetWidth}px`,
      left: `${this.props.left}px`,
      width: `${this.props.width}px`,
      height: `${topOffsetWidth}px`,
      border: '3px solid black',
      display: this.props.visible ? 'block' : 'block'
    };
    const rightStyle = {
      top: `${this.props.top - topOffsetWidth}px`,
      left: `${this.props.left}px`,
      width: `${this.props.width}px`,
      height: `${topOffsetWidth}px`,
      border: '3px solid black',
      display: this.props.visible ? 'block' : 'block'
    };

    return (
      <div>
        <div className="bc-outline-border" style={ topStyle }></div>
      </div>
    );
  }
}

BorderScrivener.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  visible: PropTypes.bool
};

export default BorderScrivener;

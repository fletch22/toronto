import React, { PropTypes } from 'react';

class BorderScrivener extends React.Component {
  render() {
    const style = {
      top: `${this.props.top - 3}px`,
      left: `${this.props.left}px`,
      width: `${this.props.width}px`,
      height: `${3}px`,
      border: '3px solid black',
      display: this.props.visible ? 'block' : 'block'
    };

    return (
     <div className="bc-outline-border" style={ style }></div>
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

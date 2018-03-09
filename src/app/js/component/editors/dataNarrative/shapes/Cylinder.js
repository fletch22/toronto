import React from 'react';

class Cylinder extends React.Component {

  render() {
    return (
      <g transform="scale(1.5)">
        <ellipse cx="25" cy="25" rx="25" ry="10" fill="purple" />
        <rect x="0" y="25" width="50" height="50" fill="purple" />
        <ellipse cx="25" cy="75" rx="25" ry="10" fill="purple" />
      </g>
    );
  }
}

export default Cylinder;

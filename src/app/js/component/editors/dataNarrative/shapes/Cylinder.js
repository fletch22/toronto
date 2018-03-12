import React from 'react';
import SvgComponent from '../SvgComponent';
import { connect } from 'react-redux';

class Cylinder extends SvgComponent {

  render() {
    return (
      <g transform="scale(1.5)" ref="rootGroup">
        <ellipse cx="25" cy="25" rx="25" ry="10" fill="purple" />
        <rect x="0" y="25" width="50" height="50" fill="purple" />
        <ellipse cx="25" cy="75" rx="25" ry="10" fill="purple" />
      </g>
    );
  }
}

Cylinder.propTypes = SvgComponent.propTypes;

const mapStateToProps = (state, ownProps) => {
  return { ...SvgComponent.mapStateToPropsDragNDrop(state, ownProps) };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const fns = {

  };

  return { ...fns, ...SvgComponent.getDragNDropFns(dispatch, ownProps) };
};

Cylinder = connect(
  mapStateToProps,
  mapDispatchToProps
)(Cylinder);


export default Cylinder;

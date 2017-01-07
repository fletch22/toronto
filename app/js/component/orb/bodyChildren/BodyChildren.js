import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import graphTraversal from '../../../state/graphTraversal';

class BodyChildren extends React.Component {

  render() {
    return (
      <div>test</div>
    );
  }
}

BodyChildren.propTypes = {
  id: PropTypes.any,
  model: PropTypes.object
};
//
// const mapStateToProps = (state, ownProps) => {
//   const viewContainer = state.dom;
//   const object = graphTraversal.find(viewContainer, ownProps.id);
//
//   const activeTab = (_.has(object, 'activeTab')) ? object.activeTab : 1;
//   const tabBodyDisabled = !_.has(ownProps, 'modelNodeId');
//
//   return {
//     activeTab,
//   };
// };

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSelect: (event) => {
      window.dispatchEvent(new Event('resize'));
      // dispatch(actionUpdateViewPropertyValue(ownProps.id, 'activeTab', event, true));
    }
  };
};

BodyChildren = connect(
  null,
  mapDispatchToProps
)(BodyChildren);

export default BodyChildren;

import React from 'react';
import StandardModal from './StandardModal';
import { connect } from 'react-redux';
import { hideStateRollbackModal } from '../../actions/index';

class StateRollbackModal extends React.Component {
  render() {
    return (
      <StandardModal showModal={this.props.showModal} onOk={this.props.onOk} headerText="Error" bodyText="" />
    );
  }
}

function onOk() {
  return (dispatch, getState) => {
    const state = getState();

    const stateRollbackModal = state.dom.modal.stateRollback;

    const stateId = stateRollbackModal.stateId;

    console.log(`Found stateID: ${stateId}`);

    return dispatch(hideStateRollbackModal());
  };
}

StateRollbackModal.propTypes = {
  showModal: React.PropTypes.bool,
  onOk: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    showModal: state.dom.modal.stateRollback.showModal
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOk: () => {
      dispatch(onOk());
    }
  };
};

StateRollbackModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(StateRollbackModal);

export default StateRollbackModal;

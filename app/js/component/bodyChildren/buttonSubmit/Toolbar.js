import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ConfigureSubmitButton from './ConfigureSubmitButton';
import { actionCreatePseudoModal } from '../../../actions/index';
import PseudoModalTypes from '../../../component/modals/PseudoModalTypes';
import actionComponentCreator from '../../../reducers/viewModelFactory';

class Toolbar extends React.Component {
  render() {
    return (
      <div>
        <ConfigureSubmitButton viewModel={this.props.selectedViewModel} onClick={this.props.onConfigClick} disabled={this.props.disabled} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedViewModel: PropTypes.object,
  onConfigClick: PropTypes.func,
  disabled: PropTypes.bool
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onConfigClick: () => {
      if (!ownProps.disabled) {
        dispatch(actionCreatePseudoModal(PseudoModalTypes.DataNarrativeEditor, ownProps.selectedViewModel.id));
      }
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

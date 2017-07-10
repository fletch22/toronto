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
        <ConfigureSubmitButton viewModel={this.props.selectedViewModel} onClick={this.props.onConfigClick} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedViewModel: PropTypes.object,
  onConfigClick: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onConfigClick: () => {
      dispatch(actionCreatePseudoModal(PseudoModalTypes.DataNarrativeEditor, ownProps.selectedViewModel.id));
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ConfigureDdl from './ConfigureDdl';
import { actionCreatePseudoModal } from '../../../actions/index';
import PseudoModalTypes from '../../../component/modals/PseudoModalTypes';
import actionComponentCreator from '../../../reducers/viewModelFactory';

class Toolbar extends React.Component {

  render() {
    return (
      <div>
        <ConfigureDdl viewModel={this.props.selectedViewModel} onClick={this.props.onConfigDdlClick} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedViewModel: PropTypes.object,
  onConfigDdlClick: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onConfigDdlClick: () => {
      dispatch(actionCreatePseudoModal(PseudoModalTypes.WizardTypes.ConfigureDdl, ownProps.selectedViewModel.viewModel.id));
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

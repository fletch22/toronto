import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ConfigureSubmitButton from './ConfigureSubmitButton';
import { actionCreatePseudoModalFromScratch } from '../../../actions/index';
import PseudoModalTypes from '../../../component/modals/PseudoModalTypes';
import graphTraversal from '../../../../../common/state/graphTraversal';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import viewModelFactory from '../../../reducers/viewModelFactory';

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

const createPseudoModal = (ownProps) => {
  return (dispatch, getState) => {
    const submitButtonModel = graphTraversal.find(getState().model, ownProps.selectedViewModel.viewModel.id);
    const dataNarrativeArray = submitButtonModel.children.filter((child) => child.typeLabel === ComponentTypes.DataNarrative);
    if (dataNarrativeArray.length > 1) {
      throw new Error(`Encountered problem while trying to find all the sole DataNarrative component inside a '${submitButtonModel.typeLabel}' component. Found ${dataNarrativeArray.length}.`);
    }
    const model = dataNarrativeArray[0];

    const viewModel = viewModelFactory.generateViewModel(ownProps.selectedViewModel.id, model);
    c.lo(viewModel, 'viewModel: ');

    dispatch(actionCreatePseudoModalFromScratch(PseudoModalTypes.DataNarrativeEditor, viewModel));
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onConfigClick: () => {
      if (!ownProps.disabled) {
        dispatch(createPseudoModal(ownProps));

        // dispatch(actionCreatePseudoModalFromExistingVm(PseudoModalTypes.DataNarrativeEditor, ownProps.selectedViewModel.id));
      }
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

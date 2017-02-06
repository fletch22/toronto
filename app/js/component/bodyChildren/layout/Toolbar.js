import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import viewModelCreator from '../../utils/viewModelCreator';
import layoutMinionModelFactory from '../../../domain/component/layoutMinionModelFactory';
import { actionToggleMinionStaticLock } from '../../../actions/bodyChildrenEditor/index';

class Toolbar extends React.Component {

  render() {
    const staticLockCssClass = (this.props.selectedViewModel.isStatic) ? 'fa-lock' : 'fa-unlock';
    let minionCssClass = 'fa-reddit-square';
    let minionClick = this.props.createLayoutMinion;
    if (this.props.selectedViewModel.isStatic) {
      minionCssClass += ' disabled';
      minionClick = undefined;
    }

    return (
      <div>
        <Button faClass={minionCssClass} onClick={minionClick} />
        <Button faClass={staticLockCssClass} onClick={this.props.toggleMinionStaticLock} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  createLayoutMinion: PropTypes.func,
  selectedViewModel: PropTypes.object,
  toggleMinionStaticLock: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createLayoutMinion: () => {
      const model = layoutMinionModelFactory.createInstance(ownProps.selectedViewModel.viewModel.id, `${new Date().getTime()}`, '1', '1', '0', '0', '');
      viewModelCreator.create(dispatch, model, ownProps.selectedViewModel.id);
    },
    toggleMinionStaticLock: () => {
      dispatch(actionToggleMinionStaticLock(ownProps.selectedViewModel.id));
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import bodyChildrenCreatorService from '../../../service/bodyChildrenCreatorService';
import layoutMinionModelFactory from '../../../domain/component/layoutMinionModelFactory';
import { actionToggleMinionStaticLock, actionToggleLayoutMinionBorders } from '../../../actions/bodyChildrenEditor/index';

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
        <Button faClass="fa-pencil-square-o" onClick={this.props.toggleMinionBorders} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  createLayoutMinion: PropTypes.func,
  selectedViewModel: PropTypes.object,
  toggleMinionStaticLock: PropTypes.func,
  toggleMinionBorders: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createLayoutMinion: () => {
      const proto = layoutMinionModelFactory.createProtoInstance(ownProps.selectedViewModel.viewModel.id, `${new Date().getTime()}`, '1', '1', '0', '0', '');
      const model = layoutMinionModelFactory.createInstanceFromModel(proto);
      bodyChildrenCreatorService.create(dispatch, model, ownProps.selectedViewModel.id);
    },
    toggleMinionStaticLock: () => {
      dispatch(actionToggleMinionStaticLock(ownProps.selectedViewModel.id));
    },
    toggleMinionBorders: () => {
      dispatch(actionToggleLayoutMinionBorders(ownProps.selectedViewModel.id));
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

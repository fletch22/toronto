import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import viewModelCreator from '../../utils/viewModelCreator';
import layoutMinionModelFactory from '../../../domain/component/layoutMinionModelFactory';
import { actionToggleMinionStaticLock } from '../../../actions/bodyChildrenEditor/index';

class Toolbar extends React.Component {

  render() {
    const faClass = 'fa-unlock';

    return (
      <div>
        <Button faClass="fa-reddit-square" onClick={this.props.createLayoutMinion} />
        <Button faClass={faClass} onClick={this.props.toggleMinionStaticLock} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedChildViewId: PropTypes.any,
  selectedChildModelId: PropTypes.any,
  createLayoutMinion: PropTypes.func,
  toggleMinionStaticLock: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createLayoutMinion: () => {
      const model = layoutMinionModelFactory.createInstance(ownProps.selectedChildModelId, `${new Date().getTime()}`, '1', '1', '0', '0');
      viewModelCreator.create(dispatch, model, ownProps.selectedChildViewId);
    },
    toggleMinionStaticLock: () => {
      dispatch(actionToggleMinionStaticLock(ownProps.selectedChildViewId));
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

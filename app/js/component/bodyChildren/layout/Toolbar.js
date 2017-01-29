import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import viewModelCreator from '../../utils/viewModelCreator';
import layoutMinionModelFactory from '../../../domain/component/layoutMinionModelFactory';

class Toolbar extends React.Component {

  render() {
    return (
      <div>
        <Button faClass="fa-reddit-square" onClick={this.props.createLayoutMinion} />
      </div>
    );
  }
}

Toolbar.propTypes = {
  selectedChildViewId: PropTypes.any,
  selectedChildModelId: PropTypes.any,
  createLayoutMinion: PropTypes.func
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    createLayoutMinion: () => {
      const model = layoutMinionModelFactory.createInstance(ownProps.selectedChildModelId, 'foo', "1", "1", "0", "0");
      viewModelCreator.create(dispatch, model, ownProps.selectedChildViewId);
    }
  };
};

Toolbar = connect(
  null,
  mapDispatchToProps
)(Toolbar);

export default Toolbar;

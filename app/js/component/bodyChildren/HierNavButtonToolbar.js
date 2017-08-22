import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from './toolbar/Button';
import { actionSetCurrentBodyToolToParent } from '../../actions/bodyChildrenEditor/index';

class HierNavButtonToolbar extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa-caret-square-o-up" tooltipText="Move up the hierarchy." onClick={this.props.onClick} disabled={this.props.disabled} />
      </div>
    );
  }
}

HierNavButtonToolbar.propTypes = {
  onClick: PropTypes.func,
  selectedChildViewId: PropTypes.any,
  disabled: PropTypes.bool
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: (event) => {
      event.stopPropagation();
      dispatch(actionSetCurrentBodyToolToParent(ownProps.selectedChildViewId));
    }
  };
};

HierNavButtonToolbar = connect(
  null,
  mapDispatchToProps
)(HierNavButtonToolbar);

export default HierNavButtonToolbar;

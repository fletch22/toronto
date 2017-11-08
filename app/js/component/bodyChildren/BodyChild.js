import React, { PropTypes } from 'react';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';

class BodyChild extends React.Component {

  constructor(props) {
    super(props);
    this.componentSelect = this.componentSelect.bind(this);
  }

  componentSelect(event) {
    event.stopPropagation();
    this.context.store.dispatch(actionSetCurrentBodyTool(this.props.id));
  }
}

BodyChild.contextTypes = { store: PropTypes.object };

BodyChild.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.any,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.array,
  style: PropTypes.string
};

export default BodyChild;

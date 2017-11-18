import React, { PropTypes } from 'react';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';
import _ from 'lodash';

class BodyChild extends React.Component {

  static mergePropTypes(descendentProps) {
    return { ...(_.cloneDeep(BodyChild.propTypes)), ...descendentProps };
  }

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
  id: PropTypes.any.isRequired,
  viewModel: PropTypes.any.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isHoveringOver: PropTypes.bool.isRequired,
  children: PropTypes.array,
  style: PropTypes.string,
  visibility: PropTypes.bool,
  canBeDroppedOn: PropTypes.bool
};

export default BodyChild;

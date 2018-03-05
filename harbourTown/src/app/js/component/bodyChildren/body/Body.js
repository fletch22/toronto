import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ComponentChild from '../ComponentChild';
import graphTraversal from '../../../../../common/state/graphTraversal';
import '../../../../css/modules/time-travel-toolbar.scss';
import SelectedContextToolbar from '../SelectedContextToolbar';
import DragAndDropMaker from '../../../component/dragAndDrop/DragAndDropMaker';
import DragAndDropUtils from '../../../component/dragAndDrop/DragAndDropUtils';
import BodyChild from '../../bodyChildren/BodyChild';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';
import { actionUnsetCurrentBody } from '../../../actions/bodyChildrenEditor/index';

class Body extends BodyChild {
  render() {
    const children = (this.props.model.children) ? this.props.model.children : [];

    const style = JSON.parse(this.props.model.style);

    return (
      <div className="flex-bc" style={ { height: '100%' } }>
        <div id={this.props.model.id} style={style}>
          {
            children.map((child) =>
              <ComponentChild key={child.id} id={child.id} model={child} />
            )
          }
        </div>
      </div>
    );
  }
}

Body.propTypes = {
  model: PropTypes.object
};

export default Body;

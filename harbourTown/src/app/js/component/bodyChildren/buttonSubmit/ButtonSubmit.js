import React, { PropTypes } from 'react';
import { connect as reduxConnect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import BodyChild from '../BodyChild';
import DragAndDropMaker from '../../dragAndDrop/DragAndDropMaker';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';

class ButtonSubmit extends BodyChild {
  render() {
    const style = JSON.parse(this.props.viewModel.viewModel.style) || {};
    style.padding = '0 2px 0 0';

    let classNames = 'button-submit';

    return DragAndDropMaker.connectDragAndDropRender(this.props, (
      <div id={this.props.model.id} onClick={this.props.onClick} style={style}>
        <button className={classNames} style={style}>{this.props.model.label}</button>
      </div>
    ));
  }
}

ButtonSubmit.propTypes = BodyChild.mergePropTypes({
  model: PropTypes.object
});

export default ButtonSubmit;

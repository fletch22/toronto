import React from 'react';
import '../../../../css/f22-react-grid-layout.css';
import BodyChild from '../BodyChild';
import DragAndDropMaker from '../../dragAndDrop/DragAndDropMaker';
import ComponentTypes from '../../../domain/component/ComponentTypes';

class DropDownListbox extends BodyChild {
  render() {
    const style = JSON.parse(this.props.viewModel.viewModel.style) || {};
    style.display = this.props.visibility ? style.display : 'none';
    const classNames = (this.props.isSelected) ? ' body-child-selected' : '';

    return DragAndDropMaker.connectDragAndDropRender(this.props, (
      <div id={this.props.id} onClick={this.componentSelect} title={this.props.viewModel.viewModel.name} data-f22-component={ComponentTypes.ButtonSubmit} style={style}>
        <select className={classNames}>
          <option>(select)</option>
        </select>
      </div>
    ));
  }
}

DropDownListbox.propTypes = BodyChild.mergePropTypes({});

DropDownListbox = DragAndDropMaker.connectDragAndDrop(DropDownListbox);

export default DropDownListbox;



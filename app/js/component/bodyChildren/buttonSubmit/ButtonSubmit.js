import React, { PropTypes } from 'react';
import { connect as reduxConnect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import BodyChild from '../BodyChild';
import DragAndDropMaker from '../../dragAndDrop/DragAndDropMaker';
import ComponentTypes from '../../../domain/component/ComponentTypes';

class ButtonSubmit extends BodyChild {

  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  render() {
    const style = JSON.parse(this.props.viewModel.viewModel.style) || {};
    style.padding = '0 4px';

    const display = this.props.visibility ? style.display : 'none';

    let classNames = 'button-submit';
    classNames += (this.props.isSelected) ? ' body-child-selected' : '';

    return DragAndDropMaker.connectDragAndDropRender(this.props, (
      <div id={this.props.id} onClick={this.props.onClick} data-f22-component={ComponentTypes.ButtonSubmit} style={{ paddingRight: '4px', display }}>
        <button className={classNames} style={style}>{this.props.label}</button>
      </div>
    ));
  }
}

ButtonSubmit.propTypes = BodyChild.mergePropTypes({
  label: PropTypes.string
});

const mapStateToProps = (state, ownProps) => {
  const viewModel = ownProps.viewModel;

  return {
    label: viewModel.viewModel.label,
    canBeDroppedOn: viewModel.canBeDroppedOn,
    visibility: viewModel.visibility
  };
};

ButtonSubmit = reduxConnect(
  mapStateToProps,
  null
)(ButtonSubmit);

ButtonSubmit = DragAndDropMaker.connectDragAndDrop(ButtonSubmit);

export default ButtonSubmit;




import React, { PropTypes } from 'react';
import { connect as reduxConnect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';
import BodyChild from '../BodyChild';
import DragAndDropMaker from '../../dragAndDrop/DragAndDropMaker';
import DropMarker from '../../bodyChildren/DropMarker';
class ButtonSubmit extends BodyChild {

  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const dispatch = this.context.store.dispatch;
  //   // c.l(`prevProps.isDragging: ${prevProps.isDragging}`);
  //   if (!prevProps.visibility && this.props.visibility) {
  //     c.l(`Setting set current body tool.`);
  //     // dispatch(actionSetCurrentBodyTool(this.props.id));
  //   }
  // }

  render() {
    const style = JSON.parse(this.props.viewModel.viewModel.style) || {};
    style.padding = '0 4px';

    const display = this.props.visibility ? 'block' : 'none';

    let classNames = 'button-submit';
    classNames += (this.props.isSelected) ? ' body-child-selected' : '';

    return DragAndDropMaker.connectRender(this.props, (
      <div id={this.props.id} onClick={this.props.onClick} style={{ paddingRight: '4px', display }}>
        <button className={classNames} style={style}>{this.props.label}</button>
        <DropMarker ownerId={this.props.id} />
      </div>
    ));
  }
}

ButtonSubmit.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.object,
  isSelected: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const viewModel = ownProps.viewModel;

  const visibility = viewModel.visibility;
  return {
    isSelected: viewModel.isSelected,
    viewModel,
    label: viewModel.viewModel.label,
    canBeDroppedOn: viewModel.canBeDroppedOn,
    dragNDrop: state.dragNDrop,
    visibility,
    f22IsDragging: viewModel.f22IsDragging
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: (event) => {
      event.stopPropagation();
      dispatch(actionSetCurrentBodyTool(ownProps.id));
    }
  };
};

ButtonSubmit = reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonSubmit);

ButtonSubmit = DragAndDropMaker.connect(ButtonSubmit);

export default ButtonSubmit;




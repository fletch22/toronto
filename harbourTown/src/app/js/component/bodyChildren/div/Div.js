import React, { PropTypes } from 'react';
import BodyChild from '../BodyChild';
import { connect } from 'react-redux';
import '../../../../css/f22-react-grid-layout.css';
import ComponentChild from '../ComponentChild';
import DragAndDropMaker from '../../dragAndDrop/DragAndDropMaker';
import ComponentTypes from '../../../../../common/domain/component/ComponentTypes';

class Div extends BodyChild {
  render() {
    const style = JSON.parse(this.props.style);
    style.border = this.props.isHoveringOver ? '2px solid red' : style.border;
    style.display = this.props.visibility ? style.display : 'none';

    return DragAndDropMaker.connectDragAndDropRender(this.props, (
      <div id={this.props.id} className="flex-bc" onClick={this.componentSelect} data-f22-component={ComponentTypes.Div} style={style}>
        {
          this.props.children.map((child) =>
            <ComponentChild key={child.id} id={child.id} viewModel={child} />
          )
        }
      </div>
    ));
  }
}

Div.propTypes = BodyChild.mergePropTypes({});

const mapStateToProps = (state, ownProps) => {
  return {
    children: ownProps.viewModel.viewModel.children,
    style: ownProps.viewModel.viewModel.style,
    visibility: ownProps.viewModel.visibility
  };
};

Div = connect(
  mapStateToProps,
  null
)(Div);

Div = DragAndDropMaker.connectDragAndDrop(Div);

export default Div;



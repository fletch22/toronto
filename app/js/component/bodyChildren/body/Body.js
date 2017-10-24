import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import ComponentChild from '../ComponentChild';
import graphTraversal from '../../../state/graphTraversal';
import 'css/modules/time-travel-toolbar';
import { actionSetCurrentBodyTool } from '../../../actions/bodyChildrenEditor/index';
import SelectedContextToolbar from '../SelectedContextToolbar';
import DragAndDropMaker from '../../../component/dragAndDrop/DragAndDropMaker';

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  render() {
    const children = (this.props.children) ? this.props.children : [];
    const wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';

    return DragAndDropMaker.connectDropRender(this.props, (
      <div className="flex-pseudo-modal" style={{ height: '100%' }}>
        <div className="body-children-toolbar-col">
          <SelectedContextToolbar selectedViewModel={this.props.selectedViewModel} />
        </div>
        <div id={this.props.id} className={wrapperClass} style={{ flexGrow: 1, marginLeft: '4px' }} onClick={this.props.selectChild}>
          {
            children.map((child) =>
              <ComponentChild key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
            )
          }
        </div>
        <div style={{ width: '4px' }} />
      </div>
    ));
  }
}

Body.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.object,
  selectedViewModel: PropTypes.object,
  selectChild: PropTypes.func,
  isSelected: PropTypes.bool,
  children: PropTypes.array,
  numChildren: PropTypes.number
};

const mapStateToProps = (state, ownProps) => {
  // c.l(`CanBeDroppedOn: ${ownProps.canBeDroppedOn}`);

  const parent = graphTraversal.find(state, ownProps.id);

  const children = parent.viewModel.children;

  let selectedViewModel;
  const selectedChildViewId = (parent.selectedChildViewId) ? parent.selectedChildViewId : parent.id;
  if (selectedChildViewId) {
    selectedViewModel = Object.assign({}, graphTraversal.find(state, selectedChildViewId));
  }

  return {
    id: ownProps.id,
    children,
    selectedViewModel,
    isSelected: selectedChildViewId === ownProps.id,
    numChildren: children.length
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectChild: (event) => {
      event.stopPropagation();
      dispatch(actionSetCurrentBodyTool(ownProps.id));
    }
  };
};

Body = DragAndDropMaker.connectDrop(Body);

Body = connect(
  mapStateToProps,
  mapDispatchToProps
)(Body);

export default Body;

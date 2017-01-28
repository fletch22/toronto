import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import BodyChildrenGenerator from './BodyChildrenGenerator';
import graphTraversal from '../../state/graphTraversal';
import util from '../../util/util';
import 'css/modules/time-travel-toolbar';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';
import SelectedContextToolbar from './SelectedContextToolbar';

class BodyChildren extends React.Component {

  render() {
    const children = (this.props.children) ? this.props.children : [];
    const wrapperClass = (this.props.isSelected) ? 'body-child-selected' : '';

    return (
      <div>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td className="body-children-toolbar-col">
                <SelectedContextToolbar selectedTypeLabel={this.props.selectedTypeLabel} selectedChildViewId={this.props.selectedChildViewId} selectedChildModelId={this.props.selectedChildModelId} />
              </td>
              <td className={wrapperClass} style={{ minWidth: '1300px', maxWidth: '1300px' }} data-viewid={this.props.viewModel.id} onClick={this.props.selectChild}>
                {
                  children.map((child) =>
                    <BodyChildrenGenerator key={child.id} id={child.id} viewModel={child} isSelected={child.isSelected} />
                  )
                }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

BodyChildren.propTypes = {
  id: PropTypes.any,
  viewModel: PropTypes.object,
  selectedChildViewId: PropTypes.any,
  selectedChildModelId: PropTypes.any,
  selectedTypeLabel: PropTypes.string,
  selectChild: PropTypes.func,
  isSelected: PropTypes.bool,
  children: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  // c.lo(state, 'state: ');

  const parent = graphTraversal.find(state, ownProps.id);
  const stateChildren = parent.viewModel.children;
  const propsChildren = ownProps.viewModel.children;

  let children = stateChildren;
  // children = ownProps.children;
  // if (!util.doArrayElementsMatchIdentities(propsChildren, stateChildren)) {
    children = [].concat(stateChildren);
  // }

  let selectedTypeLabel;
  let selectedChildModelId;
  const selectedChildViewId = (parent.selectedChildViewId) ? parent.selectedChildViewId : parent.id;
  if (selectedChildViewId) {
    const viewModel = graphTraversal.find(state, selectedChildViewId);

    selectedChildModelId = viewModel.viewModel.id;
    selectedTypeLabel = viewModel.viewModel.typeLabel;

    c.lo(viewModel, 'viewModel: ');
    c.lo(selectedChildViewId, 'selectedChildViewId: ');
    c.lo(selectedChildModelId, 'selectedChildModelId: ');
    c.lo(selectedTypeLabel, 'selectedTypeLabel: ');
  }

  // children = [].concat(stateChildren);
  // c.lo(selectedChildViewId, 'selectedChildViewId: ');

  return {
    children: children,
    selectedChildViewId,
    selectedChildModelId,
    selectedTypeLabel,
    isSelected: selectedChildViewId === ownProps.id
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // This and the tags above can be abstracted into it's own tag.
    onClick: (event) => {
      event.stopPropagation();
      dispatch(actionSetCurrentBodyTool(event.currentTarget.dataset.viewid));
    }
  };
};

BodyChildren = connect(
  mapStateToProps,
  mapDispatchToProps
)(BodyChildren);

export default BodyChildren;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import BodyChildrenGenerator from './BodyChildrenGenerator';
import graphTraversal from '../../state/graphTraversal';
import util from '../../util/util';
import 'css/modules/time-travel-toolbar';
import ComponentTypes from '../../domain/component/ComponentTypes';
import { default as LayoutToolbar } from './layout/Toolbar';
import { default as BodyToolbar } from './body/Toolbar';
import HierNavButtonToolbar from '../../component/bodyChildren/HierNavButtonToolbar';
import { actionSetCurrentBodyTool } from '../../actions/bodyChildrenEditor/index';

class BodyChildren extends React.Component {

  render() {
    const children = (this.props.children) ? this.props.children : [];

    let toolbar = '';
    switch (this.props.selectedTypeLabel) {
      case ComponentTypes.WebPage: {
        toolbar = <BodyToolbar selectedChildViewId={this.props.selectedChildViewId} selectedChildModelId={this.props.selectedChildModelId} />;
        break;
      }
      case ComponentTypes.Layout: {
        toolbar = <LayoutToolbar selectedChildViewId={this.props.selectedChildViewId} selectedChildModelId={this.props.selectedChildModelId} />;
        break;
      }
      default:
        break;
    }

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td className="body-children-toolbar-col">
                <HierNavButtonToolbar />
                { toolbar }
              </td>
              <td style={{ width: '100%' }} data-viewid={this.props.viewModel.id} onClick={this.props.selectChild}>
                {
                  children.map((child) =>
                    <BodyChildrenGenerator key={child.id} id={child.id} viewModel={child} />
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
  children: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
  c.lo(ownProps, 'BodyChildren: ');

  const parent = graphTraversal.find(state, ownProps.id);
  const stateChildren = parent.viewModel.children;
  const propsChildren = ownProps.viewModel.children;

  let children = stateChildren;
  if (!util.doArrayElementsMatchIdentities(propsChildren, stateChildren)) {
    children = [].concat(stateChildren);
  }

  let selectedTypeLabel;
  let selectedChildModelId;
  const selectedChildViewId = (parent.selectedChildViewId) ? parent.selectedChildViewId : parent.id;
  if (selectedChildViewId) {
    const viewModel = graphTraversal.find(state, selectedChildViewId);
    selectedChildModelId = viewModel.viewModel.id;
    selectedTypeLabel = viewModel.viewModel.typeLabel;
  }

  return {
    children,
    selectedChildViewId,
    selectedChildModelId,
    selectedTypeLabel
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

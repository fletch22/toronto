import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import BodyChildrenGenerator from './BodyChildrenGenerator';
import graphTraversal from '../../state/graphTraversal';
import util from '../../util/util';
import bodyChildrenCreator from '../../component/editors/bodyChildren/bodyChildrenCreator';
import 'css/modules/time-travel-toolbar';
import layoutService from '../../service/component/layoutService';
import ComponentTypes from '../../domain/component/ComponentTypes';
import { actionCreateBodyComponent } from '../../actions/index';
import layoutModelFactory from '../../domain/component/layoutModelFactory';
import actionComponentCreator from '../../reducers/actionComponentCreator';

class BodyChildren extends React.Component {

  render() {
    const children = (this.props.children) ? this.props.children : [];
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td className="body-children-toolbar-col">
                <button className="btn-f22-sys btn btn-default fa fa-object-group" onClick={this.props.makeLayout}></button>
              </td>
              <td style={{ width: '100%' }}>
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
  children: PropTypes.array,
  makeLayout: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const parent = graphTraversal.find(state, ownProps.id);
  const stateChildren = parent.viewModel.children;
  const propsChildren = ownProps.viewModel.children;

  let children = stateChildren;
  if (!util.doArrayElementsMatchIdentities(propsChildren, stateChildren)) {
    children = [].concat(stateChildren);
  }

  return {
    children
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    makeLayout: () => {
      const parentViewModel = Object.assign({}, ownProps);
      const model = layoutModelFactory.createInstance(ownProps.viewModel.id);
      const viewModel = actionComponentCreator.generateViewModel(ownProps.id, model);

      bodyChildrenCreator.createUpdate(dispatch, parentViewModel, viewModel, layoutService.createOrUpdate);
    }
  };
};

BodyChildren = connect(
  mapStateToProps,
  mapDispatchToProps
)(BodyChildren);

export default BodyChildren;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import BodyChildrenGenerator from './BodyChildrenGenerator';
import { actionCreateBodyComponent } from '../../actions/index';
import ComponentTypes from '../../domain/component/ComponentTypes';
import graphTraversal from '../../state/graphTraversal';

class BodyChildren extends React.Component {

  render() {
    const children = (this.props.viewModel.children) ? this.props.viewModel.children : [];

    return (
      <div>
        <button onClick={this.props.makeLayout}>Make Layout</button>
        <div>
        {
          children.map((child) =>
            <BodyChildrenGenerator key={child.id} id={child.id} viewModel={child} />
          )
        }
        </div>
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

  if (ownProps.children) {
    console.log(`ownProps.children length: ${ownProps.children.length}`);
  }
  const pcLength = (!!propsChildren) ? propsChildren.length : 0;
  console.log(`propsChildren length: ${pcLength}`);

  const scLength = (!!stateChildren) ? stateChildren.length : 0;
  console.log(`stateChildren length: ${scLength}`);

  c.lo({});

  // let children = stateChildren;
  // if ((pcLength !== scLength) || ) {
  //     children = [].concat(stateChildren);
  // }

  // children = JSON.parse(JSON.stringify((stateChildren)));
  let children = [];

  return {

  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    makeLayout: (event) => {
      // ViewModelCopyEditor.createUpdate(dispatch, ownProps, containerService.createOrUpdate);
      dispatch(actionCreateBodyComponent(ComponentTypes.Layout, { parentId: ownProps.id }));
    }
  };
};

BodyChildren = connect(
  mapStateToProps,
  mapDispatchToProps
)(BodyChildren);

export default BodyChildren;

import React, { PropTypes } from 'react';
import Island from '../../Island';
import { connect } from 'react-redux';
import Header from './header/Header';
import crudComponentOperations from '../../../CrudOperations';
import viewModelCreator from '../../../../component/utils/viewModelCreator';
import graphTraversal from "../../../../state/graphTraversal";

class Website extends React.Component {

  render() {
    const children = (this.props.children) ? this.props.children : [];
    return (
      <div className="dashboard-item dashboard-website col-lg-12">
        <Header viewModel={this.props.viewModel}
          onChangeLabel={this.props.onChangeLabel}
        />
        {
          children.map((child) =>
            <Island key={child.id} child={child} />
          )
        }
      </div>
    );
  }
}

Website.propTypes = {
  viewModel: PropTypes.object,
  children: PropTypes.array,
  onChangeLabel: PropTypes.func
};

function changeLabel(dispatch, ownProps) {
  viewModelCreator.update(dispatch, ownProps.viewModel);
}

const mapStateToProps = (state, ownProps) => {
  return {
    label: ownProps.viewModel.label,
    children: [].concat(ownProps.viewModel.viewModel.children)
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeLabel: () => {
      changeLabel(dispatch, ownProps);
    }
  };
};

Website = connect(
  mapStateToProps,
  mapDispatchToProps
)(Website);


export default Website;

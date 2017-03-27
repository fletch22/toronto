import React, { PropTypes } from 'react';
import Island from '../../Island';
import { connect } from 'react-redux';
import Header from './header/Header';
import crudComponentOperations from '../../../CrudOperations';
import viewModelCreator from '../../../../component/utils/viewModelCreator';

class Website extends React.Component {

  render() {
    const children = (this.props.viewModel.children) ? this.props.viewModel.children : [];

    return (
      <div className="dashboard-item dashboard-website col-lg-12">
        <Header viewModel={this.props.viewModel}
          onClickClose={this.props.onClickRemoveApp}
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
  onClickRemoveApp: PropTypes.func,
  onChangeLabel: PropTypes.func
};

function remove(component) {
  return crudComponentOperations.removeNode(component);
}

function changeLabel(dispatch, ownProps) {
  viewModelCreator.update(dispatch, ownProps.viewModel);
}

const mapStateToProps = (state, ownProps) => ({
  label: ownProps.viewModel.label
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickRemoveApp: () => {
      dispatch(remove(ownProps));
    },
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

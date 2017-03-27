import React, { PropTypes } from 'react';
import Island from '../Island';
import { connect } from 'react-redux';
import Header from './header/Header';
import viewModelCreator from '../../../component/utils/viewModelCreator';

class App extends React.Component {

  render() {
    const children = (this.props.viewModel.viewModel.children) ? this.props.viewModel.viewModel.children : [];

    // c.lo(children.length, 'App children length: ');

    return (
      <div className="container-app col-lg-2 dashboard-app">
          <Header viewModel={this.props.viewModel}
            onClickClose={this.props.onClickRemoveApp}
            onChangeLabel={this.props.onChangeLabel}
          />
          <div style={{ paddingLeft: '10px' }}>
          {
             children.map((child) =>
               <Island key={child.id} child={child} />
             )
          }
          </div>
      </div>
    );
  }
}

App.propTypes = {
  viewModel: PropTypes.object,
  onClickRemoveApp: PropTypes.func,
  onChangeLabel: PropTypes.func
};

function changeLabel(dispatch, ownProps) {
  viewModelCreator.update(dispatch, ownProps.viewModel);
}

const mapStateToProps = (state, ownProps) => {
  return {
    label: ownProps.viewModel.label
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeLabel: () => {
      changeLabel(dispatch, ownProps);
    }
  };
};

App = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);


export default App;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import '../../../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import F22Input from '../../../orb/F22Input';
import 'rc-menu/assets/index.css';
import animate from 'css-animation';
import HeaderMenu from '../../app/header/HeaderMenu';
import { actionAppToggleMenu } from '../../../../actions/dashboard/app';
import graphTraversal from '../../../../state/graphTraversal';

class Header extends React.Component {

  render() {
    return (
      <div className="container-orb">
        <div className="header-left">
          <div>
            <F22Input modelNodeId={this.props.modelNodeId} propertyName="label" onBlur={this.props.onChangeLabel} value={this.props.headerTextValue} />
          </div>
        </div>
        <div className="header-right">
          <button type="button" className="fa fa-ellipsis-v button-ellipses-v" aria-label="Close" onClick={this.props.onClickOpenMenu} />
          <HeaderMenu isShowingHeaderMenu={this.props.isShowingHeaderMenu} />
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  headerTextValue: PropTypes.string,
  modelNodeId: PropTypes.any,
  onClickClose: PropTypes.func,
  onChangeLabel: PropTypes.func,
  onClickOpenMenu: PropTypes.func,
  isShowingHeaderMenu: PropTypes.bool
};

const punkit = (label, value) => {
  console.log(`${label}: ${JSON.stringify(value)}`);
};

const mapStateToProps = (state, ownProps) => {
  const appContainerDom = state.dom.view.appContainer;
  const app = graphTraversal.find(appContainerDom.children, ownProps.modelNodeId);

   punkit('app', app);

  return {
    isShowingHeaderMenu: app.isShowingHeaderMenu
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClickOpenMenu: () => {
      console.log('modelNodeId: ' + ownProps.modelNodeId);
      dispatch(actionAppToggleMenu(ownProps.modelNodeId));
    }
  };
};

Header = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export default Header;



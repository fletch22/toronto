import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import '../../../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import F22Input from '../../../orb/F22Input';
import 'rc-menu/assets/index.css';
import animate from 'css-animation';
import HeaderMenu from '../../app/header/HeaderMenu';
import { actionAppToggleMenu } from '../../../../actions/dashboard/app';

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
          <HeaderMenu hideMenu={this.props.showHeaderMenu} />
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
  showHeaderMenu: PropTypes.bool
};

const mapDispatchToProps = (dispatch) => {
  return {
    onClickOpenMenu: () => {
      console.log(typeof actionAppToggleMenu);
      dispatch(actionAppToggleMenu());
    }
  };
};

Header = connect(
  null,
  mapDispatchToProps
)(Header);

export default Header;



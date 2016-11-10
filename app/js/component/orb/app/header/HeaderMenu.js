import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import '../../../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import { actionModalFormShow, ModalFormTypes } from '../../../../actions/modal/index';
import 'rc-menu/assets/index.css';

class HeaderMenu extends React.Component {
  render() {
    let menu;
    if (this.props.isShowingHeaderMenu) {
      menu = (<Menu onClick={this.props.onMenuClick}>
        <MenuItem key="createWebsite" className="menu-item">Create Website</MenuItem>
        <SubMenu title="2">
          <MenuItem>2-1</MenuItem>
        </SubMenu>
      </Menu>);
    }

    return (
      <div className="header-menu">
        { menu }
      </div>
    );
  }
}

HeaderMenu.propTypes = {
  isShowingHeaderMenu: PropTypes.bool,
  onMenuClick: PropTypes.func
};

const mapDispatchToProps = (dispatch) => ({
  onMenuClick: (info) => {
    switch (info.key) {
      case 'createWebsite': {
        dispatch(actionModalFormShow(ModalFormTypes.APP.CREATE_WEBSITE));
        break;
      }
      default:
    }
  }
});

HeaderMenu = connect(
  null,
  mapDispatchToProps
)(HeaderMenu);

export default HeaderMenu;

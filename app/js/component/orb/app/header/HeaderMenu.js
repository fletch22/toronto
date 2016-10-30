import React, { PropTypes } from 'react';
import Menu, { SubMenu, MenuItem } from 'rc-menu';
import '../../../../../css/modules/container.scss';  // ''font-awesome/scss/font-awesome.scss';
import 'rc-menu/assets/index.css';

class HeaderMenu extends React.Component {
  render() {
    let menu;
    if (this.props.isShowingHeaderMenu) {
      menu = (<Menu>
        <MenuItem>Create Website</MenuItem>
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
  isShowingHeaderMenu: PropTypes.bool
};

export default HeaderMenu;

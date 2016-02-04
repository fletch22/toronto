import React from 'react';

import 'css/utilities/clearfix';
import 'css/modules/header';

var divStyle = {
  color: 'red',
};

const Header = React.createClass({
  render () {
    return (
      <div className='header'>
        Headers
        <span style={divStyle}>Test</span>

      </div>
    )
  }
})

export default Header

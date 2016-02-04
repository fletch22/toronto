import React from 'react';

import 'css/utilities/clearfix';
import 'css/modules/header';

var divStyle = {
  color: 'black',
};

const Header = React.createClass({
  render () {
    return (
      <div className='header clearfix'>
        Headers
        <span style={divStyle}>Test</span>
      </div>
    )
  }
})

export default Header

import jQuery from 'jquery'
import 'css/base'

import React from 'react'
import ReactDOM from 'react-dom'
import Container from 'js/container'

global.jQuery = jQuery;
ReactDOM.render(<Container />, document.querySelector('#main'));

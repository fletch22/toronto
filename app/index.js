import jQuery from 'jquery'
import 'css/base'

import React from 'react'
import ReactDOM from 'react-dom'
import Container from 'js/container'

import App from 'js/redux/component/App'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import orbApp from './js/redux/reducers'

import 'css/modules/container'
import 'css/modules/toolbar'

global.jQuery = jQuery;

let store = createStore(orbApp)

ReactDOM.render(

	<Provider store={store}>
    	<App />
  	</Provider>,
  	document.querySelector('#main'));

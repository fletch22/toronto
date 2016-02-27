import jQuery from 'jquery';
import 'css/base';

import React from 'react';
import ReactDOM from 'react-dom';

import App from 'js/component/App';
import { Provider } from 'react-redux';

import 'css/modules/container';
import 'css/modules/toolbar';
import allStore from 'js/stores/allStore';

global.jQuery = jQuery;

ReactDOM.render(

	<Provider store={allStore}>
		<App />
	</Provider>,
	document.querySelector('#main'));

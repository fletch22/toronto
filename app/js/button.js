import React from 'react';
import AppActions from './action/AppActions';
import AppStore from './store/AppStore';

const Button = React.createClass({

	addFave(ev) {
		console.log(ev.target.innerHTML + " clicked.");
		AppActions.addApp("foo");
	},

	render () {
		return (
		  <button type="button" onClick={this.addFave}>
		    {this.props.buttonText}
		  </button>
		)
	}
})

export default Button


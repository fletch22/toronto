import React, { PropTypes } from 'react';

class Button extends React.Component {

  render() {
    let className = `btn-f22-sys btn btn-default fa ${this.props.faClass}`;
    className = this.props.disabled ? className += ' disabled' : className;

    return (
      <div>
        <button className={className} onClick={this.props.onClick} title={this.props.tooltipText}></button>
      </div>
    );
  }
}

Button.propTypes = {
  faClass: PropTypes.string,
  tooltipText: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default Button;

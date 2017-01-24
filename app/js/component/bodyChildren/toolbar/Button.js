import React, { PropTypes } from 'react';

class Button extends React.Component {

  render() {
    const className = `btn-f22-sys btn btn-default fa ${this.props.faClass}`;

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
  onClick: PropTypes.func
};

export default Button;

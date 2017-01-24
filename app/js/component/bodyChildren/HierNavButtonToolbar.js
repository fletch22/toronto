import React from 'react';
import Button from './toolbar/Button';

class HierNavButtonToolbar extends React.Component {
  render() {
    return (
      <Button faClass="fa-caret-square-o-up" tooltipText="Move up the hierarchy." />
    );
  }
}

export default HierNavButtonToolbar;

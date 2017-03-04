import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Button from '../toolbar/Button';
import ComponentTypes from '../../../domain/component/ComponentTypes';
import viewModelCreator from '../../utils/viewModelCreator';
import modelGenerator from '../../../domain/component/modelGenerator';

class ConfigureDdl extends React.Component {
  render() {
    return (
      <div>
        <Button faClass="fa fa-cog " onClick={this.props.onClick} tooltipText="Configure Select" />
      </div>
    );
  }
}

ConfigureDdl.propTypes = {
  viewModel: PropTypes.object,
  onClick: PropTypes.func
};

export default ConfigureDdl;

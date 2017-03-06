import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-bootstrap';
import { actionCarouselSlideRight, actionCarouselSlideLeft, actionCarouselSlideToIndex } from '../../../actions/wizard/index.js';
import SelectCollectionSlide from './wizard/configure/SelectCollectionView';
import SelectDdlFieldsView from './wizard/configure/SelectDdlFieldsView';
import CreateCollectionView from './wizard/configure/CreateCollectionView';
import WizardViews from './wizard/configure/WizardViews';

class ConfigureDdlWizard extends React.Component {

  render() {
    const activeIndex = this.props.activeIndex;

    return (
        <div style={{ width: '650px' }}>
          <Carousel activeIndex={activeIndex} direction={null} onSelect={this.props.handleSelect} indicators={false} interval={0} controls={false}>
            <Carousel.Item key={WizardViews.SELECT_COLLECTION_VIEW}>
              <SelectCollectionSlide wizardData={this.props.data} />
            </Carousel.Item>
            <Carousel.Item key={WizardViews.SELECT_DDL_FIELDS}>
              <SelectDdlFieldsView viewId={this.props.id} />
            </Carousel.Item>
            <Carousel.Item key={WizardViews.CREATE_COLLECTION}>
              <CreateCollectionView viewId={this.props.id} />
            </Carousel.Item>
          </Carousel>
        </div>
    );
  }
}

ConfigureDdlWizard.propTypes = {
  id: PropTypes.any,
  data: PropTypes.object,
  activeIndex: PropTypes.any,
  onCancelClick: PropTypes.func,
  handleSelect: PropTypes.func,
  onClickSlideRight: PropTypes.func,
  onClickSlideLeft: PropTypes.func,
  onClickSlideToIndex: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: ownProps.data.id,
    activeIndex: ownProps.data.activeIndex
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSelect: (selectedIndex, e) => {
      // c.l(selectedIndex);
      // c.l(e);
      // dispatch(action(ownProps.id));
    },
    onClickSlideRight: () => {
      dispatch(actionCarouselSlideRight(ownProps.id));
    },
    onClickSlideLeft: () => {
      dispatch(actionCarouselSlideLeft(ownProps.id));
    },
    onClickSlideToIndex: (event) => {
      dispatch(actionCarouselSlideToIndex(ownProps.id, event.currentTarget.dataset.index));
    }
  };
};

ConfigureDdlWizard = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigureDdlWizard);

export default ConfigureDdlWizard;

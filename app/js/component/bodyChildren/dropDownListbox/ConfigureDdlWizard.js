import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-bootstrap';
import { actionCarouselSlideRight, actionCarouselSlideLeft, actionCarouselSlideToIndex } from '../../../actions/wizard/index.js';
import SlideSelectOrAddCollection from './wizard/configure/selectOrAddCollection/SlideSelectOrAddCollection';
import SlideSelectFields from './wizard/configure/selectFields/SlideSelectFields';
import SlideChooseDataSourceType from './wizard/configure/chooseDataSourceType/SlideChooseDataSourceType';
import SlideCollectionGrid from './wizard/configure/collectionGrid/SlideCollectionGrid';
import WizardSlides from './wizard/configure/WizardSlides';
import SlideSaveDdlInfo from './wizard/configure/saveDdlInfo/SlideSaveDdlInfo';

class ConfigureDdlWizard extends React.Component {

  render() {
    const activeIndex = this.props.activeIndex;

    c.lo(this.props.onCancelClick, 'CDW in render: ownProps.onCancelClick: ');

    return (
        <div style={{ width: '100%' }}>
          <Carousel activeIndex={activeIndex} direction={null} onSelect={this.props.handleSelect} indicators={false} interval={0} controls={false}>
            <Carousel.Item key={WizardSlides.CHOOSE_DATASOURCE_TYPE}>
              <SlideChooseDataSourceType isSlideActive={activeIndex === WizardSlides.CHOOSE_DATASOURCE_TYPE} wizardData={this.props.data} />
            </Carousel.Item>
            <Carousel.Item key={WizardSlides.SELECT_OR_ADD_COLLECTION}>
              <SlideSelectOrAddCollection isSlideActive={activeIndex === WizardSlides.SELECT_OR_ADD_COLLECTION} wizardData={this.props.data} />
            </Carousel.Item>
            <Carousel.Item key={WizardSlides.SELECT_FIELDS}>
              <SlideSelectFields isSlideActive={activeIndex === WizardSlides.SELECT_FIELDS} wizardData={this.props.data} />
            </Carousel.Item>
            <Carousel.Item key={WizardSlides.COLLECTION_GRID}>
              <SlideCollectionGrid isSlideActive={activeIndex === WizardSlides.COLLECTION_GRID} wizardData={this.props.data} />
            </Carousel.Item>
            <Carousel.Item key={WizardSlides.SAVE_DDL_INFO}>
              <SlideSaveDdlInfo isSlideActive={activeIndex === WizardSlides.SAVE_DDL_INFO} wizardData={this.props.data} onCloseModal={this.props.onCancelClick} />
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
    activeIndex: ownProps.data.activeIndex,
    onCancelClick: ownProps.onCancelClick
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

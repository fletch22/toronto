import jQuery from 'jquery';

const RestService = function restService() {
  const self = this;

  self.fetch = () => jQuery.ajax({ url: 'http://offline-news-api.herokuapp.com/stories' });
};

export default new RestService();


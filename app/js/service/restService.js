import jQuery from 'jquery';
import Service from './service';

class RestService extends Service {

  getAppContainer() {
    return jQuery.ajax({
      url: `${this.getOrbServerRootUrl()}/`,
      type: 'get' // Send it through get method
    });
  }

  getComponent(id) {
    return jQuery.ajax({
      url: `${this.getOrbServerRootUrl()}/components/${id}`,
      type: 'get'
    });
  }

  addComponent(object) {
    return jQuery.ajax({
      url: `${this.getOrbServerRootUrl()}/components`,
      type: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(object)
    });
  }

  ping(object) {
    return jQuery.ajax({
      url: `${this.getOrbServerRootUrl()}/ping`,
      type: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(object)
    });
  }
}

export default new RestService();


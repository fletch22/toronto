
const DomlessAjax = function domlessAjax() {
  const self = this;

  // Simple XHR request in pure JavaScript
  self.load = function (url, json, callback, error) {
    let xhr = null;

    if (typeof XMLHttpRequest !== 'undefined') {
      xhr = new XMLHttpRequest();
    } else {
      const versions = [
        'MSXML2.XmlHttp.5.0',
        'MSXML2.XmlHttp.4.0',
        'MSXML2.XmlHttp.3.0',
        'MSXML2.XmlHttp.2.0',
        'Microsoft.XmlHttp'];

      for (let i = 0, len = versions.length; i < len; i++) {
        try {
          xhr = new ActiveXObject(versions[i]);
          break;
        } catch (e) {
          console.log(e);
        }
      }
    }

    function ensureReadiness() {
      if (xhr.readyState < 4) {
        return;
      }

      if (xhr.status !== 200) {
        return;
      }

      // All is well
      if (xhr.readyState === 4) {
        callback(xhr);
      }
    }

    xhr.open('POST', url, true);

    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onreadystatechange = ensureReadiness;
    xhr.send(json);
  };
};

export default new DomlessAjax();

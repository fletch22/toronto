import httpProxy from 'http-proxy';
import config from '../config/Config';

class ProxyDevServer {
  initialize(app) {
    const proxy = httpProxy.createProxyServer();

    app.all('/build/*', (req, res) => {
      proxy.web(req, res, {
        target: `http://localhost:${config.getWebDevServerPort()}`
      });
    });

    // It is important to catch any errors from the proxy or the
    // server will crash. An example of this is connecting to the
    // server when webpack is bundling
    proxy.on('error', (e) => {
      c.l('Could not connect to proxy, please try again...');
    });
  }
}

export default new ProxyDevServer();

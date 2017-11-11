import jQuery from 'jquery';
import AppStarter from 'js/component/AppStarter';
import favicon from 'file-loader?../images/favicon.ico';

global.jQuery = jQuery;

new AppStarter().start();

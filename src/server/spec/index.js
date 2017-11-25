import Jasmine from 'jasmine';
import c from '../../util/c.js';
import config from './../config/config';
import path from 'path';

global.c = c;

const jasmine = new Jasmine();

jasmine.loadConfig({
  spec_dir: path.join(config.getTestOuputFolderName(), 'server', 'spec'),
  spec_files: [
    '**/*[sS]pec.js'
  ],
  helpers: [
    'helpers/**/*.js'
  ],
  stopSpecOnExpectationFailure: false,
  random: false
});

jasmine.execute();

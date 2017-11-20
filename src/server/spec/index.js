import Jasmine from 'jasmine';
import c from '../../util/c';

global.c = c;

const jasmine = new Jasmine();
jasmine.loadConfigFile('src/server/spec/config/jasmine.json');
jasmine.execute();

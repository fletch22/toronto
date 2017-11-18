import Jasmine from 'jasmine';

const jasmine = new Jasmine();
jasmine.loadConfigFile('src/server/spec/config/jasmine.json');
jasmine.execute();

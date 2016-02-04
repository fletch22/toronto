// test/test_index.js

// require all modules ending in "_test" from the
// current directory and all subdirectories
import Header from '../app/js/header'
import Container from '../app/js/container'

var testsContext = require.context(".", true, /Test$/);
testsContext.keys().forEach(testsContext);
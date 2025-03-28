/* eslint-disable */

const path = require('path');

module.exports = function (config) {
	config.set({
		frameworks: ['mocha', 'chai'],
		basePath: '../',
		files: [
			// The file order below is important to prevent undefined errors during testing!
			// Load dependencies
			{ pattern: 'www/css/jqm.css', included: true, watched: false },
			{ pattern: 'www/css/main.css', included: true, watched: false },
			{ pattern: 'node_modules/mocha/mocha.css', included: true, watched: false },
			{ pattern: 'www/vendor-js/jquery.js', included: true, watched: false },
			{ pattern: 'www/vendor-js/libs.js', included: true, watched: false },
			{ pattern: 'www/vendor-js/apexcharts.min.js', included: true, watched: false },
			{ pattern: 'www/vendor-js/jqm.js', included: true, watched: false },
			{ pattern: 'www/vendor-js/dataTables-2.1.8.min.js', included: true, watched: false },
			{ pattern: 'www/index.html', included: false, watched: false, served: true },
			{ pattern: 'www/css/images/ajax-loader.gif', included: false, watched: false, served: true },
			{ pattern: 'www/js/modules/**/*.js', included: true, watched: false },
			{ pattern: 'www/js/main.js', included: true, watched: false },
			'node_modules/sinon/pkg/sinon.js',
			// Prepare the test environment server
			'test/prepare_tests.js',
			// Load all tests
			'test/tests/**/*.js',
		],
		browsers: ['ChromeHeadless'],
		singleRun: true,
	});
};

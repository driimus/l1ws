
'use strict'

module.exports = {
	displayName: 'test',
	verbose: true,
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	},
	testPathIgnorePatterns: [
		'/node_modules/',
		'/__tests__/fixtures/',
	]
}

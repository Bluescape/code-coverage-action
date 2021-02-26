// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // The directory where Jest should output its coverage files
  coverageDirectory: './coverage',
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['text', 'html', 'json-summary'],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json'],

  // Use this configuration option to add custom reporters to Jest
  reporters: ['default'],

  // The test environment that will be used for testing
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['node_modules/']
}

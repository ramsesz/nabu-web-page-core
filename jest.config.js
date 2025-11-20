module.exports = {
    // Use jsdom environment for Vue component testing
    testEnvironment: 'jsdom',

    // Look for test files with .spec.js or .test.js extensions
    testMatch: [
        '**/v2/**/*.spec.js',
        '**/v2/**/*.test.js'
    ],

    // Transform .js files with babel-jest
    transform: {
        '^.+\\.js$': 'babel-jest'
    },

    // Module file extensions
    moduleFileExtensions: ['js', 'json'],

    // Setup files to run before tests
    setupFilesAfterEnv: ['<rootDir>/test-setup.js'],

    // Coverage configuration
    collectCoverageFrom: [
        'v2/**/*.js',
        '!v2/**/*.spec.js',
        '!v2/**/*.test.js',
        '!**/node_modules/**'
    ],

    // Ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/'
    ],

    // Verbose output
    verbose: true
};

export default {
  preset:                 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',

    // Jest does not support ESM modules very well yet
    // Bellow mappings are needed to properly load Chalk in Jest context
    '^#ansi-styles$':    '<rootDir>/node_modules/chalk/source/vendor/ansi-styles/index.js',
    '^#supports-color$': '<rootDir>/node_modules/chalk/source/vendor/supports-color/index.js',

    // Temporarily mapped here, because I was unable to mock it in the tests
    // using neither `jest.mock()` nor `jest.unstable_mockModule()`.
    // ESM support in Jest is still unstable and work-in-progress.
    'callsites': '<rootDir>/mocks/callsites.ts',
  },

  testRegex: '\\.test\\.ts$',

  coverageDirectory:   'coverage',
  collectCoverageFrom: [
    '**/*.ts'
  ],

  globals: {
    'ts-jest': {
      useESM:   true,
      tsconfig: 'tsconfig.jest.json'
    }
  }
}

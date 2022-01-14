export default {
  preset:                 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',

    // Jest does not support ESM modules very well yet
    // Bellow mappings are needed to properly load Chalk in Jest context
    '^#ansi-styles$':    '<rootDir>/node_modules/chalk/source/vendor/ansi-styles/index.js',
    '^#supports-color$': '<rootDir>/node_modules/chalk/source/vendor/supports-color/index.js'
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

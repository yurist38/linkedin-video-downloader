const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'js', 'vue'],
  rootDir: '../src',
  testPathIgnorePatterns: ['node_modules', '.cache', 'dist', 'assets'],
  transform: {
    '^.+\\.ts$': ['babel-jest', { configFile: './config/babel.jest.config.js' }],
    '^.*\\.vue$': '@vue/vue3-jest',
  },
  moduleNameMapper: {
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/../config/emptyMock.js',
  },
  setupFilesAfterEnv: ['../config/jest.setup.js'],
  globals: {
    chrome: true,
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,vue}',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    },
  },
  coverageReporters: ['text', 'html'],
  coverageDirectory: '../coverage/'
};

module.exports = async () => {
  return config;
};

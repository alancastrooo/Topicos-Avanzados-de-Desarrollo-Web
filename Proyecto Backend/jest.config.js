// jest.config.js
export default {
  testEnvironment: "node",
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {},
  testMatch: ['**/tests/**/*.test.js', '**/?(*.)+(spec|test).js']
};
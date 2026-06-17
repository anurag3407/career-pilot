export default {
  testEnvironment: "node",
  verbose: true,
  testMatch: [
    "**/__tests__/**/*.test.js",
    "**/tests/**/*.test.js"
  ],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js"
  ]
};
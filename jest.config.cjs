/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  modulePathIgnorePatterns: [
    "<rootDir>/decisions",
    "<rootDir>/templates",
  ],
  projects: [
    "packages/dev"
  ],
  testEnvironment: 'node',
  reporters: ["default"],
};
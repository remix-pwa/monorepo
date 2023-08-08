/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  modulePathIgnorePatterns: [
    "<rootDir>/decisions",
    "<rootDir>/templates",
  ],
  projects: [
    "packages/dev"
  ],
  watchPlugins: [
    require.resolve("jest-watch-select-projects")
  ],
  reporters: ["default"],
};
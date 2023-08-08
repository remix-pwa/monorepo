// lint-staged configuration file
// See https://github.com/okonet/lint-staged#using-js-configuration-files
module.exports = {
  '*.js': ['prettier --write', 'eslint --cache --fix'],
  '*.{json,md}': ['prettier --write'],
};

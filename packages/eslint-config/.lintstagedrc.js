// lint-staged configuration file
// See https://github.com/okonet/lint-staged#using-js-configuration-files
export default {
  '*.js': ['prettier --write', 'eslint --cache --fix'],
  '*.{json,md}': ['prettier --write'],
};

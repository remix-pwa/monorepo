// lint-staged configuration file
// See https://github.com/okonet/lint-staged#using-js-configuration-files
export default {
  '*.{js, mjs, ts}': ['prettier --write', 'eslint --cache --fix'],
  '*.{json,md,yaml,yml}': ['prettier --write'],
};

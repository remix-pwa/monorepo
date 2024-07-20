module.exports = { extends: ['@commitlint/config-conventional'] }
/**
 * Accepted types:
 * 
 * build
 * chore
 * ci
 * docs
 * feat  // triggers a major release
 * fix  // triggers a patch release
 * perf
 * refactor
 * revert
 * style
 * test
 */
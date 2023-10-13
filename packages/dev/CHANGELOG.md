## @remix-pwa/dev 2.0.30-dev.3 (2023-10-13)


### Bug Fixes

* **dev:** fixed `NODE_ENV` inconsistencies during build a704228
* **dev:** fixed `yarn` installation dba5d3c
* **dev:** fixed CLI script assignment 7239580





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 2.0.7-dev.2

## @remix-pwa/dev 2.0.30-dev.2 (2023-10-13)


### Bug Fixes

* **bundle:** only budle routes with at least one worker export 0262b25

## @remix-pwa/dev 2.0.30-dev.1 (2023-10-07)


### Bug Fixes

* **dev:** implemented brand-new watcher for worker files/routes c067e70

## @remix-pwa/dev 2.0.29-dev.2 (2023-10-07)


### Bug Fixes

* **dev:** implemented brand-new watcher for worker files/routes c067e70

### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 2.0.7-dev.1

## @remix-pwa/dev 2.0.29-dev.1 (2023-10-04)

## @remix-pwa/dev 2.0.29 (2023-10-04)


### Bug Fixes

* **dev:** updated `watch` script to `rebuild` within `esbuild` construct 738b276

## @remix-pwa/dev 2.0.28-dev.2 (2023-10-04)


### Bug Fixes

* **dev:** updated `watch` script to `rebuild` within `esbuild` construct 738b276

## @remix-pwa/dev 2.0.28 (2023-09-30)


### Bug Fixes

* **dev:** fixed invalid build sequence 945d9b4

## @remix-pwa/dev 2.0.27 (2023-09-27)





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 2.0.6

## @remix-pwa/dev 2.0.26 (2023-09-27)


### Bug Fixes

* **compiler:** handle imports on different OS 76a9d65

## @remix-pwa/dev 2.0.26-dev.2 (2023-09-30)


### Bug Fixes

* **dev:** fixed invalid build sequence 945d9b4





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 2.0.6-dev.1

## @remix-pwa/dev 2.0.26-dev.1 (2023-09-27)


### Bug Fixes

* **compiler:** handle imports on different OS 76a9d65

## @remix-pwa/dev 2.0.25-dev.1 (2023-09-26)


### Bug Fixes

* **compiler:** remove normalize path everywhere 2b9308a
* **worker-config:** use file url to import remix config 97330cd

## @remix-pwa/dev 2.0.24 (2023-09-25)


### Bug Fixes

* **dev:** fixed erroneous importation of node into the browser 0bf8fe7

## @remix-pwa/dev 2.0.23 (2023-09-25)


### Bug Fixes

* **dev:** another day testing in the field 222f948

## @remix-pwa/dev 2.0.22 (2023-09-25)


### Bug Fixes

* **dev:** fixes to window url errors 17e363d

## @remix-pwa/dev 2.0.21 (2023-09-24)


### Bug Fixes

* **dev:** path resolution fix 7c8c76c

## @remix-pwa/dev 2.0.20 (2023-09-23)


### Bug Fixes

* **dev:** fixed build bug in development 652c9fc
* **dev:** fixed file resolution 499857b

## @remix-pwa/dev 2.0.19 (2023-09-23)


### Bug Fixes

* **dev:** fixed path resolution on Windows 194bbfb

## @remix-pwa/dev 2.0.18 (2023-09-22)


### Bug Fixes

* **dev:** fixed path error on Windows e9f2959
* **dev:** updated file urls 4db7acf





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 2.0.5

## @remix-pwa/dev 2.0.17 (2023-09-21)


### Bug Fixes

* **release:** force a new release 93dcbe7





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 2.0.4

## @remix-pwa/dev 2.0.1 (2023-09-15)





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 2.0.1

# @remix-pwa/dev 2.0.0 (2023-09-14)


### Features

* **compiler:** adding assets to the manifest 8006781
* **dev:** added `packages` command to CLI b8671f4
* **dev:** added `packages` command to CLI a158caa
* **dev:** added `sync` option to the CLI fd79fc3
* **dev:** prepping `dev` for v2 release 1ac704f
* **dev:** updated `packages` command to correctly install deps dc16886


### BREAKING CHANGES

* **dev:** Gotten README ready for next release





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 2.0.0

## @remix-pwa/dev 1.1.4 (2023-09-03)





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 1.1.1

## @remix-pwa/dev 1.1.3 (2023-09-02)





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 1.1.0

## @remix-pwa/dev 1.1.2 (2023-08-29)





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 1.0.3

## @remix-pwa/dev 1.1.1 (2023-08-28)


### Bug Fixes

* **compiler:** change virtual-module name 9bef734
* **config:** return full entry path instead of relative ac38499





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 1.0.2

# @remix-pwa/dev 1.1.0 (2023-08-27)


### Features

* **cli:** added utils and icon scaffold feature 620316d

## @remix-pwa/dev 1.0.1 (2023-08-25)


### Bug Fixes

* **dev:** updated `excluded` libs - `__test__` fix cd83968





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 1.0.1

# @remix-pwa/dev 1.0.0 (2023-08-18)


### Bug Fixes

* fixed `path` import c6266a8
* fixed build errors b9c67b4
* fixed eslint error 7035169
* fixed import resolution dcf9050
* updated imports 79175b4


### Features

* (wip) initialisation of a new PWA app 1ac2945
* `cli` coming together e5e99d9
* `cli` deps. 82f5628
* `dev` and `build` scripts for the compiler eb688da
* Added `dev` and `build` scripts d27c6b6
* added playground app 70896ba
* added spinners to cli f18cc4f
* added templates to the `dev` package 5b3bb24
* base `cli` engine 164ef99
* **compiler:** add compiler implementation 4ff039d
* **compiler:** allow any javascript related extension as user entry 2f932b3
* development icons 690ca17
* flag updates + new command 6645c30
* function templates for various cli functions 62a21b9
* Initialised `dev` package 400b925
* **linter:** setup eslint, prettier and lint-staged config packages 56e7c29
* manifest integration 7869523
* package manager detector e1f0f51
* postinstall scripts and behaviour fa09955
* Remix PWA compiler init 081d12f
* removed `inquirer` and replaced with `enquirer` 726389d
* **worker-build:** change routes array to RouteManifest 482bf25





### Dependencies

* **@remix-pwa/worker-runtime:** upgraded to 1.0.0

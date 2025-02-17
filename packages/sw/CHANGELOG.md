# @remix-pwa/sw 4.0.0-dev.1 (2024-11-06)


### Bug Fixes

* **sw:** attempted to remove barrel files 6ad7008


### BREAKING CHANGES

* **sw:** Removal of some barrel files

# @remix-pwa/sw 3.1.0-dev.1 (2024-10-11)


### Features

* **sw:** `@remix-pwa/sw` v5 first release candidate e88aedb
* **sw:** moved `ManifestLink` + new component: `PWAScripts` 7e9030b
* **sw:** new global hook + removed `SkipWaitHandler` e2c462e
* **sw:** removed `useSWEffect` hook 2088a57
* **sw:** removed manual sw loader - entirely cf2f10c

## @remix-pwa/sw 3.0.10 (2024-09-24)


### Bug Fixes

* **sw:** changed manifest link `rel` from `manifest` to `webmanifest` 942f76a

## @remix-pwa/sw 3.0.10-dev.1 (2024-09-24)


### Bug Fixes

* **sw:** changed manifest link `rel` from `manifest` to `webmanifest` 942f76a

## @remix-pwa/sw 3.0.9 (2024-08-11)


### Bug Fixes

* **sw:** added `matchOptions` for adding querying options to cache operations c87e507

## @remix-pwa/sw 3.0.9-dev.1 (2024-08-11)


### Bug Fixes

* **sw:** added `matchOptions` for adding querying options to cache operations c87e507

## @remix-pwa/sw 3.0.8 (2024-07-21)


### Bug Fixes

* **sw:** upgraded dependencies 197fc70

## @remix-pwa/sw 3.0.8-dev.1 (2024-07-20)


### Bug Fixes

* **sw:** upgraded dependencies 197fc70

## @remix-pwa/sw 3.0.7 (2024-05-20)


### Bug Fixes

* **sw:** re-fixing opaque response patch f0530fc

## @remix-pwa/sw 3.0.7-dev.1 (2024-05-20)


### Bug Fixes

* **sw:** re-fixing opaque response patch f0530fc

## @remix-pwa/sw 3.0.6 (2024-05-20)


### Bug Fixes

* **sw:** added a "No Cache" policy to cache strategies 740b258

## @remix-pwa/sw 3.0.6-dev.1 (2024-05-20)


### Bug Fixes

* **sw:** added a "No Cache" policy to cache strategies 740b258

## @remix-pwa/sw 3.0.5 (2024-05-06)


### Bug Fixes

* **sw:** added `ignoreRoutes` option to strategy 7ea97c0

## @remix-pwa/sw 3.0.5-dev.1 (2024-05-06)


### Bug Fixes

* **sw:** added `ignoreRoutes` option to strategy 7ea97c0

## @remix-pwa/sw 3.0.4 (2024-05-05)


### Bug Fixes

* **sw:** mini patches to message handler & `useSWEffect` hook 90d3a6d

## @remix-pwa/sw 3.0.4-dev.1 (2024-05-05)


### Bug Fixes

* **sw:** mini patches to message handler & `useSWEffect` hook 90d3a6d

## @remix-pwa/sw 3.0.3 (2024-04-24)


### Bug Fixes

* **sw:** added `typesVersions` to package json f8b8d0d
* **sw:** new `messageSW` utility 2bc93cd

## @remix-pwa/sw 3.0.3-dev.2 (2024-04-24)


### Bug Fixes

* **sw:** added `typesVersions` to package json f8b8d0d

## @remix-pwa/sw 3.0.3-dev.1 (2024-04-24)


### Bug Fixes

* **sw:** new `messageSW` utility 2bc93cd

## @remix-pwa/sw 3.0.2 (2024-04-14)


### Bug Fixes

* **sw:** re-pushing `sw` to nightly build 6586c68

## @remix-pwa/sw 3.0.2-dev.1 (2024-04-14)


### Bug Fixes

* **sw:** re-pushing `sw` to nightly build 6586c68

## @remix-pwa/sw 3.0.1 (2024-04-05)


### Bug Fixes

* **dev:** SSR support + document request detection 1898870
* **sw:** fixed `Logger` styling 88a7836
* **sw:** updated messaging to be more open :+1: b7f0ce5

## @remix-pwa/sw 3.0.1-dev.1 (2024-04-05)


### Bug Fixes

* **dev:** SSR support + document request detection 1898870
* **sw:** fixed `Logger` styling 88a7836
* **sw:** updated messaging to be more open :+1: b7f0ce5

# @remix-pwa/sw 3.0.0 (2024-03-28)


### Bug Fixes

* **sw:** fixed `EnhancedCache` multiple errors + new utilities d4a2cc8
* **sw:** fixed up caching a teeny-weeny bit ece4d5f
* **sw:** fixed up some bunch of hidden issues in `CacheFirst` as well as re-ordered priorities 1ac7387
* **sw:** init assetCache correctly c90cc49
* **sw:** new exports from `sw` 03316f5
* **sw:** provided new utilities + safeguards for strategies fba0038
* **sw:** removed initial validation from sw effect hook 402b16d
* **sw:** updated `EnhancedCache` for better working with base strategy 6a72e9f


### Features

* **sw:** added requests de-duping to `StaleWhileRevalidate` strategy 388057a
* **sw:** breaking changes - upgrading `@remix-pwa/sw` to `v3` d9004ea
* **sw:** getting rid of former `MessageHandler`s 7329c0f
* **sw:** new `useSWEffect` hook semantics 73516dc
* **sw:** new caching approaches + strategies f50307a
* **sw:** new message handlers 7cdc3a6
* **sw:** new message sub-module 4db3538
* **sw:** new versioning utility to handle auto-versioning 6a3543d
* **sw:** removed `NetworkOnly` strategy - it's just `fetch` 31a7c43
* **sw:** revamped `logger` - added extensibility 9c12cdc
* **sw:** supercharged `EnhancedCache` even further :fire: 10aedeb

# @remix-pwa/sw 3.0.0-dev.1 (2024-03-28)


### Bug Fixes

* **sw:** fixed `EnhancedCache` multiple errors + new utilities d4a2cc8
* **sw:** fixed up some bunch of hidden issues in `CacheFirst` as well as re-ordered priorities 1ac7387
* **sw:** provided new utilities + safeguards for strategies fba0038
* **sw:** removed initial validation from sw effect hook 402b16d


### Features

* **sw:** added requests de-duping to `StaleWhileRevalidate` strategy 388057a
* **sw:** breaking changes - upgrading `@remix-pwa/sw` to `v3` d9004ea
* **sw:** revamped `logger` - added extensibility 9c12cdc
* **sw:** supercharged `EnhancedCache` even further :fire: 10aedeb

# @remix-pwa/sw 2.2.0-dev.4 (2024-01-28)


### Bug Fixes

* **sw:** fixed up caching a teeny-weeny bit ece4d5f

# @remix-pwa/sw 2.2.0-dev.3 (2024-01-27)


### Bug Fixes

* **sw:** updated `EnhancedCache` for better working with base strategy 6a72e9f

# @remix-pwa/sw 2.2.0-dev.2 (2024-01-17)


### Bug Fixes

* **sw:** new exports from `sw` 03316f5

# @remix-pwa/sw 2.2.0-dev.1 (2024-01-15)


### Features

* **sw:** getting rid of former `MessageHandler`s 7329c0f
* **sw:** new `useSWEffect` hook semantics 73516dc
* **sw:** new caching approaches + strategies f50307a
* **sw:** new message handlers 7cdc3a6
* **sw:** new message sub-module 4db3538
* **sw:** new versioning utility to handle auto-versioning 6a3543d
* **sw:** removed `NetworkOnly` strategy - it's just `fetch` 31a7c43

## @remix-pwa/sw 2.1.13-dev.1 (2023-12-11)


### Bug Fixes

* **sw:** init assetCache correctly c90cc49

## @remix-pwa/sw 2.1.12 (2023-10-20)

## @remix-pwa/sw 2.1.12-dev.1 (2023-10-20)


### Bug Fixes

* **dev:** added SSR revalidator to `useSWEffect` 078847a
* **sw:** fixed `logger` behaviour in production 73b9f1a
* **sw:** fixed logger in production bug 54ecc9c

## @remix-pwa/sw 2.1.11-dev.3 (2023-10-13)


### Bug Fixes

* **sw:** fixed `logger` behaviour in production 73b9f1a
* **sw:** fixed logger in production bug 54ecc9c

## @remix-pwa/sw 2.1.11-dev.2 (2023-10-13)


### Bug Fixes

* **dev:** added SSR revalidator to `useSWEffect` 078847a

## @remix-pwa/sw 2.1.11-dev.1 (2023-10-07)

## @remix-pwa/sw 2.1.11 (2023-10-07)





### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.12

## @remix-pwa/sw 2.1.10-dev.2 (2023-10-07)

## @remix-pwa/sw 2.1.10 (2023-10-04)


### Bug Fixes

* **sw:** make all LoadServiceWorkerOptions fields optional 1cead35




### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.11

## @remix-pwa/sw 2.1.10-dev.1 (2023-10-04)


### Bug Fixes

* **sw:** make all LoadServiceWorkerOptions fields optional 1cead35





### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.11-dev.1

## @remix-pwa/sw 2.1.9 (2023-09-27)





### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.10

## @remix-pwa/sw 2.1.9-dev.1 (2023-09-27)





### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.10-dev.1

## @remix-pwa/sw 2.1.8-dev.2 (2023-09-27)

## @remix-pwa/sw 2.1.8 (2023-09-26)


### Bug Fixes

* **sw:** updated `loadServiceWorker` defaults format faf7158
* **sw:** updated `loadServiceWorker` defaults format cdf73e0
* **sw:** updated and sorted out sw loader params 32e92ec




### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.9-dev.3

## @remix-pwa/sw 2.1.8-dev.1 (2023-09-26)


### Bug Fixes

* **sw:** updated `loadServiceWorker` defaults format faf7158
* **sw:** updated `loadServiceWorker` defaults format cdf73e0
* **sw:** updated and sorted out sw loader params 32e92ec





### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.9-dev.1

## @remix-pwa/sw 2.1.7 (2023-09-25)


### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.8

## @remix-pwa/sw 2.1.6 (2023-09-22)


### Bug Fixes

* **dev:** updated file urls 4db7acf

## @remix-pwa/sw 2.1.5 (2023-09-21)


### Bug Fixes

* **release:** force a new release 93dcbe7





### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.7

## @remix-pwa/sw 2.1.1 (2023-09-19)

# @remix-pwa/sw 2.1.0 (2023-09-17)


### Bug Fixes

* **sw:** attmpted fix for `@remix-pwa/sw` mismatched version 2a8f6bc


### Features

* **sw:** upgraded `PrecacheHandler` - still WiP 8cb21fd





### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.2

## @remix-pwa/sw 2.0.1 (2023-09-15)


### Bug Fixes

* **sw:** fixed double HMR reload on route reload by Remix 0d2f65c





### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.1

# @remix-pwa/sw 2.0.0 (2023-09-14)


### Bug Fixes

* **packages:** testing actions f6b4b6e
* **sw:** fixed exports not found due to wrong entry e698faa
* **sw:** fixed version numbers? d9d4274


### Features

* `logger` implementation 0e8e8d9
* **sw:** `LiveReload` available for service workers cc110f2
* **sw:** added typings for remix-pwa 588eb4c
* **sw:** bumped major verson: `2.0.0` b99af93
* **sw:** new `indexedDBStore` API - exposed APIs for indexedDB usage aa06eb5
* **sw:** service worker loader function 381f8d5
* **sw:** v2 is ready 597d67a


### BREAKING CHANGES

* **packages:** bump to `v2`
* **sw:** fix semantic versioning error
* **sw:** Moving to `v2`





### Dependencies

* **@remix-pwa/cache:** upgraded to 2.0.0

# @remix-pwa/sw 1.1.0 (2023-09-02)


### Features

* **sw:** implemented `json`, `redirect` & `defer` for workers 2ea3841
* **sw:** implemented `logger` for remix-pwa e1d8d24
* **sw:** new util exports for handling requests in worker 6762585
* **sw:** new worker action & loader exports 1019ce6
* **sw:** precache handler introduced :+1: 7d5b1ed





### Dependencies

* **@remix-pwa/cache:** upgraded to 1.3.0

## @remix-pwa/sw 1.0.1 (2023-08-27)





### Dependencies

* **@remix-pwa/cache:** upgraded to 1.2.1

# @remix-pwa/sw 1.0.0 (2023-08-25)


### Features

* Initialised `sw` package b9d28dc
* **sw:** new APIs in the middle of deportation 6cf0ed6
* **sw:** new package: `@remix-pwa/sw` df0f504
* **sw:** porting `RemixNavigationHandler` to v3 3893c77
* **sw:** porting `RemixNavigationHandler` to v3 010839f





### Dependencies

* **@remix-pwa/cache:** upgraded to 1.2.0

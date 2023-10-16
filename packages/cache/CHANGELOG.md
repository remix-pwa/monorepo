## @remix-pwa/cache 2.0.12 (2023-10-07)

## @remix-pwa/cache 2.0.12-dev.1 (2023-10-07)

## @remix-pwa/cache 2.0.11-dev.2 (2023-10-07)

## @remix-pwa/cache 2.0.11 (2023-10-04)


### Bug Fixes

* **cache:** removed useless logs 03ead10

## @remix-pwa/cache 2.0.11-dev.1 (2023-10-04)


### Bug Fixes

* **cache:** removed useless logs 03ead10

## @remix-pwa/cache 2.0.10 (2023-09-27)


### Bug Fixes

* **cache:** fixed cache issue during redirects 50007f2
* **cache:** improved cache catch 4fec009

## @remix-pwa/cache 2.0.10-dev.1 (2023-09-27)


### Bug Fixes

* **cache:** fixed cache issue during redirects 50007f2
* **cache:** improved cache catch 4fec009

## @remix-pwa/cache 2.0.9-dev.3 (2023-09-27)


### Bug Fixes

* **cache:** improved cache catch 4fec009

## @remix-pwa/cache 2.0.9-dev.2 (2023-09-27)


### Bug Fixes

* **cache:** fixed cache issue during redirects 50007f2

## @remix-pwa/cache 2.0.9-dev.1 (2023-09-26)


### Bug Fixes

* **cache:** fixed LRU cleanup workflow in cache 2dc0449


### Performance Improvements

* **cache:** slightly improved lru algo bec7ca3

## @remix-pwa/cache 2.0.8 (2023-09-25)


### Bug Fixes

* **cache:** fixed caching of non-text formats in `RemixCache` b5b9efa

## @remix-pwa/cache 2.0.7 (2023-09-21)


### Bug Fixes

* **cache:** updated `RemixCache` behaviour daf1940

## @remix-pwa/cache 2.0.6 (2023-09-21)


### Bug Fixes

* **release:** force a new release 93dcbe7

## @remix-pwa/cache 2.0.2 (2023-09-17)


### Bug Fixes

* **cache:** fixed JSON error with stringifying `Inifinity` fd5408a

## @remix-pwa/cache 2.0.1 (2023-09-15)


### Bug Fixes

* **cache:** fixed cache options getting mixed up on multiple recalls 27a7073

# @remix-pwa/cache 2.0.0 (2023-09-14)


### Bug Fixes

* **cache:** added creation options to `open` cache method 7ddb6ae
* **cache:** fixed `open` function mandatory params 5c75383
* **cache:** fixed `RemixCache` putting mechanism for non-JSON responses 1a9c10b


### Features

* **cache:** prepped for `v2` 63957d9


### BREAKING CHANGES

* **cache:** Fixed up the `README.md` file

# @remix-pwa/cache 1.3.0 (2023-09-02)


### Bug Fixes

* **cache:** fixed broken LRU feature 5cd3008


### Features

* **cache:** implemented lru feature 106af88
* **cache:** improved speed of cache operations by >200% cff194f

## @remix-pwa/cache 1.2.1 (2023-08-27)

# @remix-pwa/cache 1.2.0 (2023-08-25)


### Features

* **cache:** added `open` method 9d07680

## @remix-pwa/cache 1.1.1 (2023-08-19)


### Bug Fixes

* **cache:** TS silly types errors that just decided to show up 788d898
* **cache:** TS silly types errors that just decided to show up 0ace7c9

# @remix-pwa/cache 1.1.0 (2023-08-19)


### Bug Fixes

* **cache:** fixed `RemixCache` initialisation errors 718670c
* **cache:** fixed cache not getting returned when using short-hand a634fb7


### Features

* **cache:** exported all new APIs + updated JSDocs 7f80b34
* **cache:** new api: `RemixCacheStorage` for handling all caches 4c5edb7
* **cache:** updated `cachified` adapter: added `ttl` to new cache 41bd0c4
* **cache:** updated cache and optimized it's perfomance by about 600% a0484c6
* new cachified wrapper 8d8e1e7

# @remix-pwa/cache 1.0.0 (2023-08-18)


### Features

* **??:** untold + unfinished cache features 84651d6
* added `cachified` 8d0d2b6
* **cache:** added `package.json` for cache package 3ac1573
* **cache:** built and exported adapters from cache package 245fd72
* **cache:** new package: `@remix-pwa/cache` 4b32bb5

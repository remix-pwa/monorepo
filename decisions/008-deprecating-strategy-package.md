## Deprecating the `strategy` package

Date: 2024-03-26

Status: Accepted

Commit: [`6ce22b`](https://github.com/remix-pwa/monorepo/commit/6ce22b94662ce853fa27b57e79065e50249d1071)

### Context

Remix PWA v3 shipped a new package, `@remix-pwa/strategy`. This package was meant to provide a more flexible way to define caching strategies for the Service Worker as well as providing just-in-time (JiT) support for requests made on the fly. However, the package was heavily reliant on the `cache` package which was, in short, a disaster. It also was very rigid and wasn't inline with our core tenets for Remix PWA (stick to the platform - no need to abstract much!).

### Decision

Deprecate the `strategy` package and bring back the class template used for strategies in Remix PWA v2.

### Consequences

Pros:

- Platform-friendly. Utilising the Web fully without needing to invent something new.

Cons: None

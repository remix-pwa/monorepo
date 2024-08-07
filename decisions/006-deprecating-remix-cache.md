## Deprecating Remix Cache

Date: 2023-11-30

Status: Accepted

### Context

Remix PWA provided a cache package that was meant to supercharge a normal browser cache. This lead to a lot of confusion and issues with the cache package. It also lead to a lot of perfomance overhead, as unimportant read/write operations were happening for every request. There was also bugs stemming from incompatibility between cache versions. A package meant to simplify the caching process was causing more issues than it was solving.

### Decision

Deprecate the Remix Cache package and remove it from the Remix PWA codebase.

### Consequences

Unavailability of the Remix Cache package.

Pros:

- Less confusion and issues with the cache package.
- Shifted to a more traditional, web-friendly approach with strategies in `@remix-pwa/sw`
- Less performance overhead.

Cons: None

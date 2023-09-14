## Why we needed a cache package

Date: 2023-08-19

Status: Accepted

### Context

`remix-pwa` has been known for giving Remix application a touch of native. Offline experience, to be precise. And over the last year,
we've attempted to solve that in multiple ways. The latest of which was via the strategy approach using `@remix-pwa/sw@1.x.x`, which
was a great approach, but it had a few issues:

- It was not very flexible
- It was extensible but had some limitations, especially when it came to document caching.
- It was quite opinionated, and it was hard to override some of the default behaviors without digging into the source code.

Due to this, we decided to take a step back and rethink the approach. We wanted to make it more flexible, extensible, and less opinionated. Plus, something that even if we get wrong on our first try, it would be easy to go back to the drawing board and have a
second look at.

### Decision

The result of this is the `@remix-pwa/cache` package. It is a standalone package that can be used to cache any resource. Think of it
as the cache powerhouse of `remix-pwa`, goes hand-in-hand with `@remix-pwa/sw@^2.x.x` and a sandbox for anything caching. We've heard the need for integration with more development tools and this package is a step towards that.

### Consequences

Pros:

- It is going to be more flexible and extensible.
- It is going to be less opinionated and heavily pluggable
- Built to fit in with external tools like 🫙 [cachified](https://github.com/Xiphe/cachified) and 🔥 [node-lru-cache](https://github.com/isaacs/node-lru-cache)

Cons:

- It is going to be a bit more complex to use, but we are going to provide a lot of examples and documentation to make it easier to use.
- You might have to wait a while for this to mature, I mean, it's a new package, and we are still working on it plus I am working.
- It is going to make your head blow 🤯!

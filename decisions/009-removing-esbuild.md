## Removing ESBuild (entirely)

Date: 2024-08-07

Status: Accepted

Commit: [`ff629b`](https://github.com/remix-pwa/monorepo/commit/ff629bac27b5c5a83dbd249734e3b6b75ae75db2)

### Context

Remix PWA `dev` package houses the main compiler for Remix PWA. Ever since its inception, it has been powered by ESBuild to do most of the heavy-lifting. When Remix v2.3.x was released and a shift towards Vite was made, we migrated the compiler partially to Vite.
Keeping the ESBuild dependency to do handle the core transpilation, and Vite for everything else. Remix finally adopted Vite completely, stripping support for ESBuild and it's time we do the same. Shipping just support for Vite, with older `v3.x.x` versions available for ESBuild support.

### Decision

Migrate `@remix-pwa/dev` to Vite entirely.

### Consequences

Pros:

- Up-to-date Remix support.
- Following in Remix's footsteps

Cons:

- Older Remix apps no longer recieve support :(

## Typescript Only

Date: 2023-08-04

Status: Accepted

### Context

Typescript is a superset of Javascript that adds type annotations and other features to the language. It is a popular choice for writing web packages and dependencies.

A challenge with Typescript is handling dependencies that aren't written in Typescript especially when working on a low level (digging deep into dependencies). But this is getting less of an issue due to migration of a lot of projects to Typescript.

### Decision

Utilising Typescript for all packages and dependencies where applicable especially the published packages (like `@remix-pwa/sw`), in order to benefit from the advantages of Typescript.

In internal tools and scripts, like `/scripts`, javascript as a language would still be a no-brainer in a lot of cases.

### Consequences

Typescript is a superset of Javascript, so it is possible to write Javascript code in a Typescript file. However, Typescript is a different language, and it is not possible to write Typescript code in a Javascript file.

The pros are:

- Static type checking
- Better IDE support
- Better refactoring support

Cons are:

- More building and transpiling steps
- More complex tooling

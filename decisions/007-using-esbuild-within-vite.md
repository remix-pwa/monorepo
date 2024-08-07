## Using Esbuild Within Vite

Date: 2023-12-17

Status: Accepted

### Context

During the monumental shift of Remix from ESBuild to Vite (v2.3.0), we had to make a decision on how to handle the migration whilst keeping support for ESBuild during the early stages of Vite's adoption.

Whilst transforming Remix PWA into a Vite plugin was no problem, we had issues with interacting with the Remix codebase due to a lack of API standardization as well as I (ShafSpecs) having little experience with Vite Plugin API. Migrating core features to Vite, whilst using ESBuild as the bundler is the way forward.

### Decision

We will use ESBuild within Vite to handle building the Service Worker.

### Consequences

Pros: None

Cons:

- Isn't the most ideal solution, but it's the best we can do for now.

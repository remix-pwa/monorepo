## Using vitest

Date: 2023-08-10

Status: Accepted

### Context

Test-driven development is a software development process that relies on the repetition of a very short development cycle: requirements are turned into very specific test cases, then the code is improved so that the tests pass. 

In the Javascript ecosystem, a lot of tools are available to help with this process. I daresay the most popular of which is Jest, a testing framework developed by Facebook. However, Jest is not without its flaws. For one, it is slow. It is also not very configurable and to be honest, quite complicated (for me at least). 

Another powerful and viable option is Vitest, a testing framework developed by the creator of Vue.js. It is fast, configurable, and easy to use. It is also very lightweight and has a very small footprint. Plus, it's vite == esbuild == fast 🤪.

### Decision

Jest was originally the testing framework for `remix-pwa` v3 but after some consideration, I and my fellow contributors decided to use Vitest instead.

### Consequences

Vitest is a fast, configurable, and easy to use framework. It is build on top of Vite and esbuild, which are both fast and lightweight. 

Pros:

- Fast: Shorter testing times, currently averaging about 400ms for the **entire** test suite to run.
- Configurable: Vitest is very configurable.
- Lighter: This makes out entire code not bloated plus a few less dependencies and plugins

Cons: 

None that I know of here
## No Testing in `@remix-pwa/client`

Date: 2023-08-18

Status: Accepted

### Context

By default, a testing approach (TDD) is a great developmental process to have within your code in order to ensure that your code is working as expected. However, there are some cases where testing is not necessary. In the case of `@remix-pwa/client`, testing the codebase was simply not funny. Due to `@remix-pwa/client` being built entirely on Project Fugu, a set of APIs that are present in newer browsers, mocking these features was a challenge and quite difficult.

### Decision

Skip testing in `@remix-pwa/client` and rely solely on intuition and manual testing.

### Consequences

Pros: None

Cons: 

- I have no idea what might be in store for me

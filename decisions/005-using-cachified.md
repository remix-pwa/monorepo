## Using Cachified natively

Date: 2023-08-19

Status: Accepted

### Context

`@remix-pwa/cache` is a package that provides caching capabilities to Remix. It
utilises everything web under the hood and supercharges it to provide some additional capabilities. Because of this, it takes a very different approach to the last caching solution we had provided. The strategy approach (which was the main backbone of `v2.x.x`) is out of the window for this, or is it? 

### Decision

`cachified` is the sole dependency of `@remix-pwa/cache` and it is for a very good reason, like mentioned above, we stuck with the web and used it to our advantage. I decided to integrate cachified natively into the package for a few reasons, namely, it is a little powerhouse with massive extensibility. 

Looking at the new approach `remix-pwa` is taking: bringing the worker thread directly into loaders and actions, it makes sense to have a caching solution that is also directly integrated into the package and has been tested over and over within the Remix community. This is where `cachified` comes in, as a solution that is less-opinionanted and more flexible, it is a perfect fit for `remix-pwa`. 
Coupled with the fact that it provides in-built extensibility for Redis and in-memory caching (the other two caching approach you would ever need, if you ask me), it is a no-brainer to use it as the caching solution for `remix-pwa`. Being able to use the same caching solution for both the client and the server is a massive win for us, as it means we can provide a consistent caching experience for both the client and the server.

### Consequences

Pros:

- We can use the same caching solution for both the client and the server (No, I am not repeating myself, this is a massive win for us)
- Lower learning curve, since `cachified` is already a well-known solution within the Remix community
- More extensibility, since `cachified` provides in-built extensibility for Redis and in-memory caching, you can dream up more caching solutions and implement them yourself to work hand-in-hand with the browser `Cache` API (which `@remix-pwa/cache` is built upon)
- More flexibility, since `cachified` is less-opinionated, you can use it in any way you want, it is up to you to decide how you want to use it

Cons: 

- Using an alternative to `cachified` is eh... possible, but difficult. I am all ears regarding this, if this becomes an issue, we are happy to expose more inner workings of `@remix-pwa/cache` to allow for more flexibility.

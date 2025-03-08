var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _Logger = class _Logger2 {
  constructor(o) {
    __publicField(this, "options");
    __publicField(this, "inGroup", false);
    this.options = { ..._Logger2.defaultOptions, ...o };
  }
  setLogLevel(o) {
    this.options.logLevel = o;
  }
  setStyles(o) {
    this.options.styles = { ...this.options.styles, ...o };
  }
  print(o, r) {
    const { isProductionEnv: i, styles: e } = this.options;
    if (i)
      return;
    const t = o;
    if ("groupCollapsed" === t && /^((?!chrome|android).*safari)/i.test(navigator.userAgent))
      return void console[t](...r);
    const n = Object.entries(e[o]).map(([o2, r2]) => `${o2}: ${r2}`).join("; "), s = this.inGroup ? [] : [`%c${this.options.prefix}`, n];
    console[t](...s, ...r), "groupCollapsed" === t && (this.inGroup = true), "groupEnd" === t && (this.inGroup = false);
  }
  debug(...o) {
    this.shouldLog("debug") && this.print("debug", o);
  }
  info(...o) {
    this.shouldLog("info") && this.print("info", o);
  }
  log(...o) {
    this.shouldLog("log") && this.print("log", o);
  }
  warn(...o) {
    this.shouldLog("warn") && this.print("warn", o);
  }
  error(...o) {
    this.shouldLog("error") && this.print("error", o);
  }
  groupCollapsed(...o) {
    this.print("groupCollapsed", o);
  }
  groupEnd() {
    this.print("groupEnd", []);
  }
  shouldLog(o) {
    const { logLevel: r } = this.options, i = ["debug", "info", "log", "warn", "error"];
    return i.indexOf(o) >= i.indexOf(r);
  }
};
__publicField(_Logger, "defaultOptions", { prefix: "remix-pwa", styles: { debug: { background: "#7f8c8d", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, info: { background: "#3498db", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, log: { background: "#2ecc71", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, warn: { background: "#f39c12", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, error: { background: "#c0392b", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, groupCollapsed: { background: "#3498db", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, groupEnd: { background: null, color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" } }, logLevel: "debug", isProductionEnv: false });
let Logger = _Logger;
const logger = new Logger();
self.addEventListener("install", (event) => {
  logger.log("installing service worker");
  logger.warn("This is a playground service worker 📦. It is not intended for production use.");
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
const entryWorker = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$4 = Object.getOwnPropertyNames;
var __esm$4 = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames$4(fn)[0]])(fn = 0)), res;
};
var __commonJS$4 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$4(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var init_define_process_env$4 = __esm$4({
  "<define:process.env>"() {
  }
});
var require_worker_runtime$4 = __commonJS$4({
  "@remix-pwa/worker-runtime"(exports, module) {
    init_define_process_env$4();
    module.exports = {};
  }
});
require_worker_runtime$4();
var __getOwnPropNames$3 = Object.getOwnPropertyNames;
var __esm$3 = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames$3(fn)[0]])(fn = 0)), res;
};
var __commonJS$3 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$3(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var init_define_process_env$3 = __esm$3({
  "<define:process.env>"() {
  }
});
var require_worker_runtime$3 = __commonJS$3({
  "@remix-pwa/worker-runtime"(exports, module) {
    init_define_process_env$3();
    module.exports = {};
  }
});
require_worker_runtime$3();
var __getOwnPropNames$2 = Object.getOwnPropertyNames;
var __esm$2 = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames$2(fn)[0]])(fn = 0)), res;
};
var __commonJS$2 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var init_define_process_env$2 = __esm$2({
  "<define:process.env>"() {
  }
});
var require_worker_runtime$2 = __commonJS$2({
  "@remix-pwa/worker-runtime"(exports, module) {
    init_define_process_env$2();
    module.exports = {};
  }
});
require_worker_runtime$2();
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __esm$1 = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames$1(fn)[0]])(fn = 0)), res;
};
var __commonJS$1 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$1(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var init_define_process_env$1 = __esm$1({
  "<define:process.env>"() {
  }
});
var require_worker_runtime$1 = __commonJS$1({
  "@remix-pwa/worker-runtime"(exports, module) {
    init_define_process_env$1();
    module.exports = {};
  }
});
require_worker_runtime$1();
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var init_define_process_env = __esm({
  "<define:process.env>"() {
  }
});
var require_worker_runtime = __commonJS({
  "@remix-pwa/worker-runtime"(exports, module) {
    init_define_process_env();
    module.exports = {};
  }
});
require_worker_runtime();
const assets = [
  "/entry.worker.js",
  "/favicon.ico"
];
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: false,
    hasAction: false,
    hasClientLoader: false,
    hasClientAction: false
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    hasLoader: false,
    hasAction: false,
    hasClientLoader: false,
    hasClientAction: false
  },
  "routes/recipe": {
    id: "routes/recipe",
    parentId: "root",
    path: "/recipe/:id",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: false,
    hasAction: false,
    hasClientLoader: false,
    hasClientAction: false
  },
  "routes/create": {
    id: "routes/create",
    parentId: "root",
    path: "/create",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: false,
    hasAction: false,
    hasClientLoader: false,
    hasClientAction: false
  },
  "routes/saved": {
    id: "routes/saved",
    parentId: "root",
    path: "/saved",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: false,
    hasAction: false,
    hasClientLoader: false,
    hasClientAction: false
  }
};
const entry = { module: entryWorker };
/**
 * @remix-run/router v1.22.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);
var ServerMode;
(function(ServerMode2) {
  ServerMode2["Development"] = "development";
  ServerMode2["Production"] = "production";
  ServerMode2["Test"] = "test";
})(ServerMode || (ServerMode = {}));
function isDeferredData(value) {
  const deferred = value;
  return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
const redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function isRedirectStatusCode(statusCode) {
  return redirectStatusCodes.has(statusCode);
}
function isRedirectResponse(response) {
  return isRedirectStatusCode(response.status);
}
function isTrackedPromise(value) {
  return value != null && typeof value.then === "function" && value._tracked === true;
}
const redirect = (url, init = 302) => {
  let responseInit = init;
  if (typeof responseInit === "number") {
    responseInit = { status: responseInit };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  const headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  return new Response(null, {
    ...responseInit,
    headers
  });
};
const json = (data, init = {}) => {
  const responseInit = typeof init === "number" ? { status: init } : init;
  const headers = new Headers(responseInit.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers
  });
};
function sanitizeError(error, serverMode) {
  if (error instanceof Error && serverMode !== ServerMode.Development) {
    const sanitized = new Error("Unexpected Server Error");
    sanitized.stack = void 0;
    return sanitized;
  }
  return error;
}
function serializeError(error, serverMode) {
  const sanitized = sanitizeError(error, serverMode);
  return {
    message: sanitized.message,
    stack: sanitized.stack
  };
}
function clone(_object) {
  const init = {};
  for (const property in _object) {
    init[property] = _object[property];
  }
  return init;
}
function getURLParameters(request, path = "") {
  const url = new URL(request.url);
  const match = matchPath(path, url.pathname);
  return {
    ...Object.fromEntries(new URL(request.url).searchParams.entries()),
    ...match == null ? void 0 : match.params
  };
}
function stripIndexParameter(request) {
  const url = new URL(request.url);
  const indexValues = url.searchParams.getAll("index");
  const indexValuesToKeep = [];
  url.searchParams.delete("index");
  for (const indexValue of indexValues) {
    if (indexValue) {
      indexValuesToKeep.push(indexValue);
    }
  }
  for (const toKeep of indexValuesToKeep) {
    url.searchParams.append("index", toKeep);
  }
  return new Request(url.href, { ...clone(request), duplex: "half" });
}
function stripDataParameter(request) {
  const url = new URL(request.url);
  url.searchParams.delete("_data");
  return new Request(url.href, { ...clone(request), duplex: "half" });
}
function stripRouteParameter(request) {
  const url = new URL(request.url);
  url.searchParams.delete("_route");
  return new Request(url.href, { ...clone(request), duplex: "half" });
}
function createArgumentsFrom({ event, loadContext, path }) {
  const request = stripRouteParameter(stripDataParameter(stripIndexParameter(event.request.clone())));
  const parameters = getURLParameters(request, path);
  return {
    request,
    params: parameters,
    context: loadContext
  };
}
function isMethod(request, methods) {
  return methods.includes(request.method.toLowerCase());
}
function isLoaderMethod(request) {
  return isMethod(request, ["get"]);
}
function isActionMethod(request) {
  return isMethod(request, ["post", "delete", "put", "patch", "head"]);
}
function isActionRequest(request, spaMode = false) {
  const url = new URL(request.url);
  const qualifies = spaMode ? url.searchParams.get("_route") : url.searchParams.get("_data");
  return isActionMethod(request) && qualifies;
}
function isLoaderRequest(request, spaMode = false) {
  const url = new URL(request.url);
  const qualifies = spaMode ? url.searchParams.get("_route") : url.searchParams.get("_data");
  return isLoaderMethod(request) && qualifies;
}
var responses = {};
function errorResponseToJson(errorResponse) {
  return responses.json(errorResponse.error || { message: "Unexpected Server Error" }, {
    status: errorResponse.status,
    statusText: errorResponse.statusText,
    headers: {
      "X-Remix-Error": "yes"
    }
  });
}
function isRemixResponse(response) {
  return Array.from(response.headers.keys()).some((key) => key.toLowerCase().startsWith("x-remix-"));
}
const DEFERRED_VALUE_PLACEHOLDER_PREFIX = "__deferred_promise:";
function createDeferredReadableStream(deferredData, signal, serverMode) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const criticalData = {};
      const preresolvedKeys = [];
      for (const [key, value] of Object.entries(deferredData.data)) {
        if (isTrackedPromise(value)) {
          criticalData[key] = `${DEFERRED_VALUE_PLACEHOLDER_PREFIX}${key}`;
          if (typeof value._data !== "undefined" || typeof value._error !== "undefined") {
            preresolvedKeys.push(key);
          }
        } else {
          criticalData[key] = value;
        }
      }
      controller.enqueue(encoder.encode(JSON.stringify(criticalData) + "\n\n"));
      for (const preresolvedKey of preresolvedKeys) {
        enqueueTrackedPromise(controller, encoder, preresolvedKey, deferredData.data[preresolvedKey], serverMode);
      }
      const unsubscribe = deferredData.subscribe((aborted, settledKey) => {
        if (settledKey) {
          enqueueTrackedPromise(controller, encoder, settledKey, deferredData.data[settledKey], serverMode);
        }
      });
      await deferredData.resolveData(signal);
      unsubscribe();
      controller.close();
    }
  });
  return stream;
}
function enqueueTrackedPromise(controller, encoder, settledKey, promise, serverMode) {
  if ("_error" in promise) {
    controller.enqueue(encoder.encode("error:" + JSON.stringify({
      [settledKey]: promise._error instanceof Error ? serializeError(promise._error, serverMode) : promise._error
    }) + "\n\n"));
  } else {
    controller.enqueue(encoder.encode("data:" + JSON.stringify({ [settledKey]: promise._data ?? null }) + "\n\n"));
  }
}
var define_process_env_default = { NODE_ENV: "development", __REMIX_PWA_SPA_MODE: "true" };
async function handleRequest({ defaultHandler: defaultHandler2, errorHandler, event, loadContext, routes: routes2 }) {
  var _a, _b;
  const isSPAMode = String(true) === "true";
  const isSingleFetchMode = String(define_process_env_default.__REMIX_SINGLE_FETCH) === "true";
  const url = new URL(event.request.url);
  let routeId;
  if (!isSPAMode) {
    routeId = url.searchParams.get("_data");
  } else {
    routeId = url.searchParams.get("_route");
  }
  if (isSingleFetchMode)
    routeId = null;
  const route = routeId ? routes2[routeId] : void 0;
  const _arguments = {
    request: event.request,
    params: getURLParameters(event.request, route == null ? void 0 : route.path),
    context: loadContext
  };
  try {
    if (isLoaderRequest(event.request, isSPAMode) && (route == null ? void 0 : route.hasWorkerLoader) && ((_a = route == null ? void 0 : route.module) == null ? void 0 : _a.workerLoader)) {
      return await handleLoader({
        event,
        loader: route.module.workerLoader,
        routeId: route.id,
        routePath: route.path,
        loadContext
      }).then(responseHandler);
    }
    if (isActionRequest(event.request, isSPAMode) && (route == null ? void 0 : route.hasWorkerAction) && ((_b = route == null ? void 0 : route.module) == null ? void 0 : _b.workerAction)) {
      return await handleAction({
        event,
        action: route.module.workerAction,
        routeId: route.id,
        routePath: route.path,
        loadContext
      }).then(responseHandler);
    }
  } catch (error) {
    const handler = (error2) => errorHandler(error2, _arguments);
    return _errorHandler({ error, handler });
  }
  return defaultHandler2(_arguments);
}
async function handleLoader({ event, loadContext, loader, routeId, routePath }) {
  const _arguments = createArgumentsFrom({ event, loadContext, path: routePath });
  const result = await loader(_arguments);
  if (result === void 0) {
    throw new Error(`You defined a loader for route "${routeId}" but didn't return anything from your \`worker loader\` function. Please return a value or \`null\`.`);
  }
  if (isDeferredData(result)) {
    if (result.init && isRedirectStatusCode(result.init.status || 200)) {
      return redirect(new Headers(result.init.headers).get("Location"), result.init);
    }
    const body = createDeferredReadableStream(result, event.request.signal, ServerMode.Production);
    const init = result.init || {};
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "text/remix-deferred");
    init.headers = headers;
    return new Response(body, init);
  }
  return isResponse(result) ? result : json(result);
}
async function handleAction({ action, event, loadContext, routeId, routePath }) {
  const _arguments = createArgumentsFrom({ event, loadContext, path: routePath });
  const result = await action(_arguments);
  if (result === void 0) {
    throw new Error(`You defined an action for route "${routeId}" but didn't return anything from your \`worker action\` function. Please return a value or \`null\`.`);
  }
  return isResponse(result) ? result : json(result);
}
function _errorHandler({ error, handler: handleError }) {
  if (isResponse(error)) {
    error.headers.set("X-Remix-Catch", "yes");
    return error;
  }
  if (isRouteErrorResponse(error)) {
    error.error && handleError(error.error);
    return errorResponseToJson(error);
  }
  const errorInstance = error instanceof Error ? error : new Error("Unexpected Server Error");
  handleError(errorInstance);
  return json({ message: errorInstance.message }, {
    status: 500,
    headers: {
      "X-Remix-Error": "yes"
    }
  });
}
function responseHandler(response) {
  if (isRedirectResponse(response)) {
    const headers2 = new Headers(response.headers);
    headers2.set("X-Remix-Redirect", headers2.get("Location"));
    headers2.set("X-Remix-Status", String(response.status));
    headers2.delete("Location");
    if (response.headers.get("Set-Cookie") !== null) {
      headers2.set("X-Remix-Revalidate", "yes");
    }
    return new Response(null, {
      status: 204,
      headers: headers2
    });
  }
  const isNotRemixResponse = !isRemixResponse(response);
  const headers = isNotRemixResponse ? new Headers(response.headers) : response.headers;
  if (isNotRemixResponse) {
    headers.set("X-Remix-Response", "yes");
    if (response.status < 200) {
      return new Response(response.body, { headers });
    }
    return new Response(response.body, { headers, status: response.status, statusText: response.statusText });
  }
  return response;
}
const _self = self;
function createContext(event) {
  var _a, _b;
  const context = ((_b = (_a = entry.module).getLoadContext) == null ? void 0 : _b.call(_a, event)) || {};
  return {
    event,
    fetchFromServer: () => fetch(event.request.clone()),
    // NOTE: we want the user to override the above properties if needed.
    ...context
  };
}
const defaultHandler = entry.module.defaultFetchHandler || ((event) => fetch(event.request.clone()));
const defaultErrorHandler = entry.module.errorHandler || ((error, { request }) => {
  if (!request.signal.aborted) {
    console.error(error);
  }
});
_self.__workerManifest = {
  // Re-publishing this. Somehow it's not available as `latest`
  assets,
  routes
};
_self.addEventListener(
  "fetch",
  (event) => {
    const response = handleRequest({
      event,
      routes,
      defaultHandler,
      errorHandler: defaultErrorHandler,
      loadContext: createContext(event)
    });
    return event.respondWith(response);
  }
);

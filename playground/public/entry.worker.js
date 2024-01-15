var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// routes-module:root.tsx?worker
var require_root = __commonJS({
  "routes-module:root.tsx?worker"(exports, module) {
    module.exports = {};
  }
});

// ../node_modules/@remix-run/router/dist/router.js
var router_exports = {};
__export(router_exports, {
  AbortedDeferredError: () => AbortedDeferredError,
  Action: () => Action,
  IDLE_BLOCKER: () => IDLE_BLOCKER,
  IDLE_FETCHER: () => IDLE_FETCHER,
  IDLE_NAVIGATION: () => IDLE_NAVIGATION,
  UNSAFE_DEFERRED_SYMBOL: () => UNSAFE_DEFERRED_SYMBOL,
  UNSAFE_DeferredData: () => DeferredData,
  UNSAFE_ErrorResponseImpl: () => ErrorResponseImpl,
  UNSAFE_convertRouteMatchToUiMatch: () => convertRouteMatchToUiMatch,
  UNSAFE_convertRoutesToDataRoutes: () => convertRoutesToDataRoutes,
  UNSAFE_getResolveToMatches: () => getResolveToMatches,
  UNSAFE_invariant: () => invariant,
  UNSAFE_warning: () => warning,
  createBrowserHistory: () => createBrowserHistory,
  createHashHistory: () => createHashHistory,
  createMemoryHistory: () => createMemoryHistory,
  createPath: () => createPath,
  createRouter: () => createRouter,
  createStaticHandler: () => createStaticHandler,
  defer: () => defer,
  generatePath: () => generatePath,
  getStaticContextFromError: () => getStaticContextFromError,
  getToPathname: () => getToPathname,
  isDeferredData: () => isDeferredData,
  isRouteErrorResponse: () => isRouteErrorResponse,
  joinPaths: () => joinPaths,
  json: () => json,
  matchPath: () => matchPath,
  matchRoutes: () => matchRoutes,
  normalizePathname: () => normalizePathname,
  parsePath: () => parsePath,
  redirect: () => redirect,
  redirectDocument: () => redirectDocument,
  resolvePath: () => resolvePath,
  resolveTo: () => resolveTo,
  stripBasename: () => stripBasename
});
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function createMemoryHistory(options) {
  if (options === void 0) {
    options = {};
  }
  let {
    initialEntries = ["/"],
    initialIndex,
    v5Compat = false
  } = options;
  let entries;
  entries = initialEntries.map((entry2, index2) => createMemoryLocation(entry2, typeof entry2 === "string" ? null : entry2.state, index2 === 0 ? "default" : void 0));
  let index = clampIndex(initialIndex == null ? entries.length - 1 : initialIndex);
  let action = Action.Pop;
  let listener = null;
  function clampIndex(n) {
    return Math.min(Math.max(n, 0), entries.length - 1);
  }
  function getCurrentLocation() {
    return entries[index];
  }
  function createMemoryLocation(to, state, key) {
    if (state === void 0) {
      state = null;
    }
    let location2 = createLocation(entries ? getCurrentLocation().pathname : "/", to, state, key);
    warning(location2.pathname.charAt(0) === "/", "relative pathnames are not supported in memory history: " + JSON.stringify(to));
    return location2;
  }
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return getCurrentLocation();
    },
    createHref,
    createURL(to) {
      return new URL(createHref(to), "http://localhost");
    },
    encodeLocation(to) {
      let path = typeof to === "string" ? parsePath(to) : to;
      return {
        pathname: path.pathname || "",
        search: path.search || "",
        hash: path.hash || ""
      };
    },
    push(to, state) {
      action = Action.Push;
      let nextLocation = createMemoryLocation(to, state);
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 1
        });
      }
    },
    replace(to, state) {
      action = Action.Replace;
      let nextLocation = createMemoryLocation(to, state);
      entries[index] = nextLocation;
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 0
        });
      }
    },
    go(delta) {
      action = Action.Pop;
      let nextIndex = clampIndex(index + delta);
      let nextLocation = entries[nextIndex];
      index = nextIndex;
      if (listener) {
        listener({
          action,
          location: nextLocation,
          delta
        });
      }
    },
    listen(fn) {
      listener = fn;
      return () => {
        listener = null;
      };
    }
  };
  return history;
}
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window2, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window2.location;
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function createHashHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createHashLocation(window2, globalHistory) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = parsePath(window2.location.hash.substr(1));
    if (!pathname.startsWith("/") && !pathname.startsWith(".")) {
      pathname = "/" + pathname;
    }
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createHashHref(window2, to) {
    let base = window2.document.querySelector("base");
    let href = "";
    if (base && base.getAttribute("href")) {
      let url = window2.location.href;
      let hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function validateHashLocation(location2, to) {
    warning(location2.pathname.charAt(0) === "/", "relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")");
  }
  return getUrlBasedHistory(createHashLocation, createHashHref, validateHashLocation, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined")
      console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location2, index) {
  return {
    usr: location2.state,
    key: location2.key,
    idx: index
  };
}
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location2 = _extends({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location2;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window2.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location2 = createLocation(history.location, to, state);
    if (validateLocation)
      validateLocation(location2, to);
    index = getIndex() + 1;
    let historyState = getHistoryState(location2, index);
    let url = history.createHref(location2);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location2 = createLocation(history.location, to, state);
    if (validateLocation)
      validateLocation(location2, to);
    index = getIndex();
    let historyState = getHistoryState(location2, index);
    let url = history.createHref(location2);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
function isIndexRoute(route) {
  return route.index === true;
}
function convertRoutesToDataRoutes(routes2, mapRouteProperties, parentPath, manifest) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  if (manifest === void 0) {
    manifest = {};
  }
  return routes2.map((route, index) => {
    let treePath = [...parentPath, index];
    let id = typeof route.id === "string" ? route.id : treePath.join("-");
    invariant(route.index !== true || !route.children, "Cannot specify children on an index route");
    invariant(!manifest[id], 'Found a route id collision on id "' + id + `".  Route id's must be globally unique within Data Router usages`);
    if (isIndexRoute(route)) {
      let indexRoute = _extends({}, route, mapRouteProperties(route), {
        id
      });
      manifest[id] = indexRoute;
      return indexRoute;
    } else {
      let pathOrLayoutRoute = _extends({}, route, mapRouteProperties(route), {
        id,
        children: void 0
      });
      manifest[id] = pathOrLayoutRoute;
      if (route.children) {
        pathOrLayoutRoute.children = convertRoutesToDataRoutes(route.children, mapRouteProperties, treePath, manifest);
      }
      return pathOrLayoutRoute;
    }
  });
}
function matchRoutes(routes2, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  let location2 = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location2.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes2);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(
      branches[i],
      // Incoming pathnames are generally encoded from either window.location
      // or from router.navigate, but we want to match against the unencoded
      // paths in the route definitions.  Memory router locations won't be
      // encoded here but there also shouldn't be anything to decode so this
      // should be a safe operation.  This avoids needing matchRoutes to be
      // history-aware.
      safelyDecodeURI(pathname)
    );
  }
  return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
  let {
    route,
    pathname,
    params
  } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    handle: route.handle
  };
}
function flattenRoutes(routes2, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes2.forEach((route, index) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0)
    return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b2) => a.score !== b2.score ? b2.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b2.routesMeta.map((meta) => meta.childrenIndex)));
}
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b2) {
  let siblings = a.length === b2.length && a.slice(0, -1).every((n, i) => n === b2[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b2[b2.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    if (!match)
      return null;
    Object.assign(matchedParams, match.params);
    let route = meta.route;
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function generatePath(originalPath, params) {
  if (params === void 0) {
    params = {};
  }
  let path = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    warning(false, 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
    path = path.replace(/\*$/, "/*");
  }
  const prefix = path.startsWith("/") ? "/" : "";
  const stringify = (p) => p == null ? "" : typeof p === "string" ? p : String(p);
  const segments = path.split(/\/+/).map((segment, index, array) => {
    const isLastSegment = index === array.length - 1;
    if (isLastSegment && segment === "*") {
      const star = "*";
      return stringify(params[star]);
    }
    const keyMatch = segment.match(/^:([\w-]+)(\??)$/);
    if (keyMatch) {
      const [, key, optional] = keyMatch;
      let param = params[key];
      invariant(optional === "?" || param != null, 'Missing ":' + key + '" param');
      return stringify(param);
    }
    return segment.replace(/\?$/g, "");
  }).filter((segment) => !!segment);
  return prefix + segments.join("/");
}
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
  if (!match)
    return null;
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
      memo[paramName] = safelyDecodeURIComponent(value || "", paramName);
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
  } else
    ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function safelyDecodeURI(value) {
  try {
    return decodeURI(value);
  } catch (error) {
    warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value;
  }
}
function safelyDecodeURIComponent(value, paramName) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    warning(false, 'The value for the URL param "' + paramName + '" will not be decoded because' + (' the string "' + value + '" is a malformed URL segment. This is probably') + (" due to a bad percent encoding (" + error + ")."));
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/")
    return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1)
        segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === matches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map((match) => match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
function getToPathname(to) {
  return to === "" || to.pathname === "" ? "/" : typeof to === "string" ? parsePath(to).pathname : to.pathname;
}
function isTrackedPromise(value) {
  return value instanceof Promise && value._tracked === true;
}
function unwrapTrackedPromise(value) {
  if (!isTrackedPromise(value)) {
    return value;
  }
  if (value._error) {
    throw value._error;
  }
  return value._data;
}
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
function createRouter(init) {
  const routerWindow = init.window ? init.window : typeof window !== "undefined" ? window : void 0;
  const isBrowser = typeof routerWindow !== "undefined" && typeof routerWindow.document !== "undefined" && typeof routerWindow.document.createElement !== "undefined";
  const isServer = !isBrowser;
  invariant(init.routes.length > 0, "You must provide a non-empty routes array to createRouter");
  let mapRouteProperties;
  if (init.mapRouteProperties) {
    mapRouteProperties = init.mapRouteProperties;
  } else if (init.detectErrorBoundary) {
    let detectErrorBoundary = init.detectErrorBoundary;
    mapRouteProperties = (route) => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  let manifest = {};
  let dataRoutes = convertRoutesToDataRoutes(init.routes, mapRouteProperties, void 0, manifest);
  let inFlightDataRoutes;
  let basename = init.basename || "/";
  let future = _extends({
    v7_fetcherPersist: false,
    v7_normalizeFormMethod: false,
    v7_partialHydration: false,
    v7_prependBasename: false,
    v7_relativeSplatPath: false
  }, init.future);
  let unlistenHistory = null;
  let subscribers = /* @__PURE__ */ new Set();
  let savedScrollPositions = null;
  let getScrollRestorationKey = null;
  let getScrollPosition = null;
  let initialScrollRestored = init.hydrationData != null;
  let initialMatches = matchRoutes(dataRoutes, init.history.location, basename);
  let initialErrors = null;
  if (initialMatches == null) {
    let error = getInternalRouterError(404, {
      pathname: init.history.location.pathname
    });
    let {
      matches,
      route
    } = getShortCircuitMatches(dataRoutes);
    initialMatches = matches;
    initialErrors = {
      [route.id]: error
    };
  }
  let initialized;
  let hasLazyRoutes = initialMatches.some((m) => m.route.lazy);
  let hasLoaders = initialMatches.some((m) => m.route.loader);
  if (hasLazyRoutes) {
    initialized = false;
  } else if (!hasLoaders) {
    initialized = true;
  } else if (future.v7_partialHydration) {
    let loaderData = init.hydrationData ? init.hydrationData.loaderData : null;
    let errors = init.hydrationData ? init.hydrationData.errors : null;
    initialized = initialMatches.every((m) => m.route.loader && m.route.loader.hydrate !== true && (loaderData && loaderData[m.route.id] !== void 0 || errors && errors[m.route.id] !== void 0));
  } else {
    initialized = init.hydrationData != null;
  }
  let router;
  let state = {
    historyAction: init.history.action,
    location: init.history.location,
    matches: initialMatches,
    initialized,
    navigation: IDLE_NAVIGATION,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: init.hydrationData != null ? false : null,
    preventScrollReset: false,
    revalidation: "idle",
    loaderData: init.hydrationData && init.hydrationData.loaderData || {},
    actionData: init.hydrationData && init.hydrationData.actionData || null,
    errors: init.hydrationData && init.hydrationData.errors || initialErrors,
    fetchers: /* @__PURE__ */ new Map(),
    blockers: /* @__PURE__ */ new Map()
  };
  let pendingAction = Action.Pop;
  let pendingPreventScrollReset = false;
  let pendingNavigationController;
  let pendingViewTransitionEnabled = false;
  let appliedViewTransitions = /* @__PURE__ */ new Map();
  let removePageHideEventListener = null;
  let isUninterruptedRevalidation = false;
  let isRevalidationRequired = false;
  let cancelledDeferredRoutes = [];
  let cancelledFetcherLoads = [];
  let fetchControllers = /* @__PURE__ */ new Map();
  let incrementingLoadId = 0;
  let pendingNavigationLoadId = -1;
  let fetchReloadIds = /* @__PURE__ */ new Map();
  let fetchRedirectIds = /* @__PURE__ */ new Set();
  let fetchLoadMatches = /* @__PURE__ */ new Map();
  let activeFetchers = /* @__PURE__ */ new Map();
  let deletedFetchers = /* @__PURE__ */ new Set();
  let activeDeferreds = /* @__PURE__ */ new Map();
  let blockerFunctions = /* @__PURE__ */ new Map();
  let ignoreNextHistoryUpdate = false;
  function initialize() {
    unlistenHistory = init.history.listen((_ref) => {
      let {
        action: historyAction,
        location: location2,
        delta
      } = _ref;
      if (ignoreNextHistoryUpdate) {
        ignoreNextHistoryUpdate = false;
        return;
      }
      warning(blockerFunctions.size === 0 || delta != null, "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.");
      let blockerKey = shouldBlockNavigation({
        currentLocation: state.location,
        nextLocation: location2,
        historyAction
      });
      if (blockerKey && delta != null) {
        ignoreNextHistoryUpdate = true;
        init.history.go(delta * -1);
        updateBlocker(blockerKey, {
          state: "blocked",
          location: location2,
          proceed() {
            updateBlocker(blockerKey, {
              state: "proceeding",
              proceed: void 0,
              reset: void 0,
              location: location2
            });
            init.history.go(delta);
          },
          reset() {
            let blockers = new Map(state.blockers);
            blockers.set(blockerKey, IDLE_BLOCKER);
            updateState({
              blockers
            });
          }
        });
        return;
      }
      return startNavigation(historyAction, location2);
    });
    if (isBrowser) {
      restoreAppliedTransitions(routerWindow, appliedViewTransitions);
      let _saveAppliedTransitions = () => persistAppliedTransitions(routerWindow, appliedViewTransitions);
      routerWindow.addEventListener("pagehide", _saveAppliedTransitions);
      removePageHideEventListener = () => routerWindow.removeEventListener("pagehide", _saveAppliedTransitions);
    }
    if (!state.initialized) {
      startNavigation(Action.Pop, state.location, {
        initialHydration: true
      });
    }
    return router;
  }
  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }
    if (removePageHideEventListener) {
      removePageHideEventListener();
    }
    subscribers.clear();
    pendingNavigationController && pendingNavigationController.abort();
    state.fetchers.forEach((_, key) => deleteFetcher(key));
    state.blockers.forEach((_, key) => deleteBlocker(key));
  }
  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }
  function updateState(newState, opts) {
    if (opts === void 0) {
      opts = {};
    }
    state = _extends({}, state, newState);
    let completedFetchers = [];
    let deletedFetchersKeys = [];
    if (future.v7_fetcherPersist) {
      state.fetchers.forEach((fetcher, key) => {
        if (fetcher.state === "idle") {
          if (deletedFetchers.has(key)) {
            deletedFetchersKeys.push(key);
          } else {
            completedFetchers.push(key);
          }
        }
      });
    }
    [...subscribers].forEach((subscriber) => subscriber(state, {
      deletedFetchers: deletedFetchersKeys,
      unstable_viewTransitionOpts: opts.viewTransitionOpts,
      unstable_flushSync: opts.flushSync === true
    }));
    if (future.v7_fetcherPersist) {
      completedFetchers.forEach((key) => state.fetchers.delete(key));
      deletedFetchersKeys.forEach((key) => deleteFetcher(key));
    }
  }
  function completeNavigation(location2, newState, _temp) {
    var _location$state, _location$state2;
    let {
      flushSync
    } = _temp === void 0 ? {} : _temp;
    let isActionReload = state.actionData != null && state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && state.navigation.state === "loading" && ((_location$state = location2.state) == null ? void 0 : _location$state._isRedirect) !== true;
    let actionData;
    if (newState.actionData) {
      if (Object.keys(newState.actionData).length > 0) {
        actionData = newState.actionData;
      } else {
        actionData = null;
      }
    } else if (isActionReload) {
      actionData = state.actionData;
    } else {
      actionData = null;
    }
    let loaderData = newState.loaderData ? mergeLoaderData(state.loaderData, newState.loaderData, newState.matches || [], newState.errors) : state.loaderData;
    let blockers = state.blockers;
    if (blockers.size > 0) {
      blockers = new Map(blockers);
      blockers.forEach((_, k2) => blockers.set(k2, IDLE_BLOCKER));
    }
    let preventScrollReset = pendingPreventScrollReset === true || state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && ((_location$state2 = location2.state) == null ? void 0 : _location$state2._isRedirect) !== true;
    if (inFlightDataRoutes) {
      dataRoutes = inFlightDataRoutes;
      inFlightDataRoutes = void 0;
    }
    if (isUninterruptedRevalidation)
      ;
    else if (pendingAction === Action.Pop)
      ;
    else if (pendingAction === Action.Push) {
      init.history.push(location2, location2.state);
    } else if (pendingAction === Action.Replace) {
      init.history.replace(location2, location2.state);
    }
    let viewTransitionOpts;
    if (pendingAction === Action.Pop) {
      let priorPaths = appliedViewTransitions.get(state.location.pathname);
      if (priorPaths && priorPaths.has(location2.pathname)) {
        viewTransitionOpts = {
          currentLocation: state.location,
          nextLocation: location2
        };
      } else if (appliedViewTransitions.has(location2.pathname)) {
        viewTransitionOpts = {
          currentLocation: location2,
          nextLocation: state.location
        };
      }
    } else if (pendingViewTransitionEnabled) {
      let toPaths = appliedViewTransitions.get(state.location.pathname);
      if (toPaths) {
        toPaths.add(location2.pathname);
      } else {
        toPaths = /* @__PURE__ */ new Set([location2.pathname]);
        appliedViewTransitions.set(state.location.pathname, toPaths);
      }
      viewTransitionOpts = {
        currentLocation: state.location,
        nextLocation: location2
      };
    }
    updateState(_extends({}, newState, {
      actionData,
      loaderData,
      historyAction: pendingAction,
      location: location2,
      initialized: true,
      navigation: IDLE_NAVIGATION,
      revalidation: "idle",
      restoreScrollPosition: getSavedScrollPosition(location2, newState.matches || state.matches),
      preventScrollReset,
      blockers
    }), {
      viewTransitionOpts,
      flushSync: flushSync === true
    });
    pendingAction = Action.Pop;
    pendingPreventScrollReset = false;
    pendingViewTransitionEnabled = false;
    isUninterruptedRevalidation = false;
    isRevalidationRequired = false;
    cancelledDeferredRoutes = [];
    cancelledFetcherLoads = [];
  }
  async function navigate(to, opts) {
    if (typeof to === "number") {
      init.history.go(to);
      return;
    }
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, to, future.v7_relativeSplatPath, opts == null ? void 0 : opts.fromRouteId, opts == null ? void 0 : opts.relative);
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, false, normalizedPath, opts);
    let currentLocation = state.location;
    let nextLocation = createLocation(state.location, path, opts && opts.state);
    nextLocation = _extends({}, nextLocation, init.history.encodeLocation(nextLocation));
    let userReplace = opts && opts.replace != null ? opts.replace : void 0;
    let historyAction = Action.Push;
    if (userReplace === true) {
      historyAction = Action.Replace;
    } else if (userReplace === false)
      ;
    else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state.location.pathname + state.location.search) {
      historyAction = Action.Replace;
    }
    let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : void 0;
    let flushSync = (opts && opts.unstable_flushSync) === true;
    let blockerKey = shouldBlockNavigation({
      currentLocation,
      nextLocation,
      historyAction
    });
    if (blockerKey) {
      updateBlocker(blockerKey, {
        state: "blocked",
        location: nextLocation,
        proceed() {
          updateBlocker(blockerKey, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: nextLocation
          });
          navigate(to, opts);
        },
        reset() {
          let blockers = new Map(state.blockers);
          blockers.set(blockerKey, IDLE_BLOCKER);
          updateState({
            blockers
          });
        }
      });
      return;
    }
    return await startNavigation(historyAction, nextLocation, {
      submission,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: error,
      preventScrollReset,
      replace: opts && opts.replace,
      enableViewTransition: opts && opts.unstable_viewTransition,
      flushSync
    });
  }
  function revalidate() {
    interruptActiveLoads();
    updateState({
      revalidation: "loading"
    });
    if (state.navigation.state === "submitting") {
      return;
    }
    if (state.navigation.state === "idle") {
      startNavigation(state.historyAction, state.location, {
        startUninterruptedRevalidation: true
      });
      return;
    }
    startNavigation(pendingAction || state.historyAction, state.navigation.location, {
      overrideNavigation: state.navigation
    });
  }
  async function startNavigation(historyAction, location2, opts) {
    pendingNavigationController && pendingNavigationController.abort();
    pendingNavigationController = null;
    pendingAction = historyAction;
    isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
    saveScrollPosition(state.location, state.matches);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    pendingViewTransitionEnabled = (opts && opts.enableViewTransition) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let loadingNavigation = opts && opts.overrideNavigation;
    let matches = matchRoutes(routesToUse, location2, basename);
    let flushSync = (opts && opts.flushSync) === true;
    if (!matches) {
      let error = getInternalRouterError(404, {
        pathname: location2.pathname
      });
      let {
        matches: notFoundMatches,
        route
      } = getShortCircuitMatches(routesToUse);
      cancelActiveDeferreds();
      completeNavigation(location2, {
        matches: notFoundMatches,
        loaderData: {},
        errors: {
          [route.id]: error
        }
      }, {
        flushSync
      });
      return;
    }
    if (state.initialized && !isRevalidationRequired && isHashChangeOnly(state.location, location2) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
      completeNavigation(location2, {
        matches
      }, {
        flushSync
      });
      return;
    }
    pendingNavigationController = new AbortController();
    let request = createClientSideRequest(init.history, location2, pendingNavigationController.signal, opts && opts.submission);
    let pendingActionData;
    let pendingError;
    if (opts && opts.pendingError) {
      pendingError = {
        [findNearestBoundary(matches).route.id]: opts.pendingError
      };
    } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
      let actionOutput = await handleAction2(request, location2, opts.submission, matches, {
        replace: opts.replace,
        flushSync
      });
      if (actionOutput.shortCircuited) {
        return;
      }
      pendingActionData = actionOutput.pendingActionData;
      pendingError = actionOutput.pendingActionError;
      loadingNavigation = getLoadingNavigation(location2, opts.submission);
      flushSync = false;
      request = new Request(request.url, {
        signal: request.signal
      });
    }
    let {
      shortCircuited,
      loaderData,
      errors
    } = await handleLoaders(request, location2, matches, loadingNavigation, opts && opts.submission, opts && opts.fetcherSubmission, opts && opts.replace, opts && opts.initialHydration === true, flushSync, pendingActionData, pendingError);
    if (shortCircuited) {
      return;
    }
    pendingNavigationController = null;
    completeNavigation(location2, _extends({
      matches
    }, pendingActionData ? {
      actionData: pendingActionData
    } : {}, {
      loaderData,
      errors
    }));
  }
  async function handleAction2(request, location2, submission, matches, opts) {
    if (opts === void 0) {
      opts = {};
    }
    interruptActiveLoads();
    let navigation = getSubmittingNavigation(location2, submission);
    updateState({
      navigation
    }, {
      flushSync: opts.flushSync === true
    });
    let result;
    let actionMatch = getTargetMatch(matches, location2);
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      result = {
        type: ResultType.error,
        error: getInternalRouterError(405, {
          method: request.method,
          pathname: location2.pathname,
          routeId: actionMatch.route.id
        })
      };
    } else {
      result = await callLoaderOrAction("action", request, actionMatch, matches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath);
      if (request.signal.aborted) {
        return {
          shortCircuited: true
        };
      }
    }
    if (isRedirectResult(result)) {
      let replace;
      if (opts && opts.replace != null) {
        replace = opts.replace;
      } else {
        replace = result.location === state.location.pathname + state.location.search;
      }
      await startRedirectNavigation(state, result, {
        submission,
        replace
      });
      return {
        shortCircuited: true
      };
    }
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      if ((opts && opts.replace) !== true) {
        pendingAction = Action.Push;
      }
      return {
        // Send back an empty object we can use to clear out any prior actionData
        pendingActionData: {},
        pendingActionError: {
          [boundaryMatch.route.id]: result.error
        }
      };
    }
    if (isDeferredResult(result)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    return {
      pendingActionData: {
        [actionMatch.route.id]: result.data
      }
    };
  }
  async function handleLoaders(request, location2, matches, overrideNavigation, submission, fetcherSubmission, replace, initialHydration, flushSync, pendingActionData, pendingError) {
    let loadingNavigation = overrideNavigation || getLoadingNavigation(location2, submission);
    let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, activeSubmission, location2, future.v7_partialHydration && initialHydration === true, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionData, pendingError);
    cancelActiveDeferreds((routeId) => !(matches && matches.some((m) => m.route.id === routeId)) || matchesToLoad && matchesToLoad.some((m) => m.route.id === routeId));
    pendingNavigationLoadId = ++incrementingLoadId;
    if (matchesToLoad.length === 0 && revalidatingFetchers.length === 0) {
      let updatedFetchers2 = markFetchRedirectsDone();
      completeNavigation(location2, _extends({
        matches,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: pendingError || null
      }, pendingActionData ? {
        actionData: pendingActionData
      } : {}, updatedFetchers2 ? {
        fetchers: new Map(state.fetchers)
      } : {}), {
        flushSync
      });
      return {
        shortCircuited: true
      };
    }
    if (!isUninterruptedRevalidation && (!future.v7_partialHydration || !initialHydration)) {
      revalidatingFetchers.forEach((rf) => {
        let fetcher = state.fetchers.get(rf.key);
        let revalidatingFetcher = getLoadingFetcher(void 0, fetcher ? fetcher.data : void 0);
        state.fetchers.set(rf.key, revalidatingFetcher);
      });
      let actionData = pendingActionData || state.actionData;
      updateState(_extends({
        navigation: loadingNavigation
      }, actionData ? Object.keys(actionData).length === 0 ? {
        actionData: null
      } : {
        actionData
      } : {}, revalidatingFetchers.length > 0 ? {
        fetchers: new Map(state.fetchers)
      } : {}), {
        flushSync
      });
    }
    revalidatingFetchers.forEach((rf) => {
      if (fetchControllers.has(rf.key)) {
        abortFetcher(rf.key);
      }
      if (rf.controller) {
        fetchControllers.set(rf.key, rf.controller);
      }
    });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((f2) => abortFetcher(f2.key));
    if (pendingNavigationController) {
      pendingNavigationController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    }
    let {
      results,
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state.matches, matches, matchesToLoad, revalidatingFetchers, request);
    if (request.signal.aborted) {
      return {
        shortCircuited: true
      };
    }
    if (pendingNavigationController) {
      pendingNavigationController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    }
    revalidatingFetchers.forEach((rf) => fetchControllers.delete(rf.key));
    let redirect4 = findRedirect(results);
    if (redirect4) {
      if (redirect4.idx >= matchesToLoad.length) {
        let fetcherKey = revalidatingFetchers[redirect4.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      await startRedirectNavigation(state, redirect4.result, {
        replace
      });
      return {
        shortCircuited: true
      };
    }
    let {
      loaderData,
      errors
    } = processLoaderData(state, matches, matchesToLoad, loaderResults, pendingError, revalidatingFetchers, fetcherResults, activeDeferreds);
    activeDeferreds.forEach((deferredData, routeId) => {
      deferredData.subscribe((aborted) => {
        if (aborted || deferredData.done) {
          activeDeferreds.delete(routeId);
        }
      });
    });
    let updatedFetchers = markFetchRedirectsDone();
    let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId);
    let shouldUpdateFetchers = updatedFetchers || didAbortFetchLoads || revalidatingFetchers.length > 0;
    return _extends({
      loaderData,
      errors
    }, shouldUpdateFetchers ? {
      fetchers: new Map(state.fetchers)
    } : {});
  }
  function fetch2(key, routeId, href, opts) {
    if (isServer) {
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.");
    }
    if (fetchControllers.has(key))
      abortFetcher(key);
    let flushSync = (opts && opts.unstable_flushSync) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, href, future.v7_relativeSplatPath, routeId, opts == null ? void 0 : opts.relative);
    let matches = matchRoutes(routesToUse, normalizedPath, basename);
    if (!matches) {
      setFetcherError(key, routeId, getInternalRouterError(404, {
        pathname: normalizedPath
      }), {
        flushSync
      });
      return;
    }
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, true, normalizedPath, opts);
    if (error) {
      setFetcherError(key, routeId, error, {
        flushSync
      });
      return;
    }
    let match = getTargetMatch(matches, path);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    if (submission && isMutationMethod(submission.formMethod)) {
      handleFetcherAction(key, routeId, path, match, matches, flushSync, submission);
      return;
    }
    fetchLoadMatches.set(key, {
      routeId,
      path
    });
    handleFetcherLoader(key, routeId, path, match, matches, flushSync, submission);
  }
  async function handleFetcherAction(key, routeId, path, match, requestMatches, flushSync, submission) {
    interruptActiveLoads();
    fetchLoadMatches.delete(key);
    if (!match.route.action && !match.route.lazy) {
      let error = getInternalRouterError(405, {
        method: submission.formMethod,
        pathname: path,
        routeId
      });
      setFetcherError(key, routeId, error, {
        flushSync
      });
      return;
    }
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getSubmittingFetcher(submission, existingFetcher), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal, submission);
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let actionResult = await callLoaderOrAction("action", fetchRequest, match, requestMatches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath);
    if (fetchRequest.signal.aborted) {
      if (fetchControllers.get(key) === abortController) {
        fetchControllers.delete(key);
      }
      return;
    }
    if (future.v7_fetcherPersist && deletedFetchers.has(key)) {
      if (isRedirectResult(actionResult) || isErrorResult(actionResult)) {
        updateFetcherState(key, getDoneFetcher(void 0));
        return;
      }
    } else {
      if (isRedirectResult(actionResult)) {
        fetchControllers.delete(key);
        if (pendingNavigationLoadId > originatingLoadId) {
          updateFetcherState(key, getDoneFetcher(void 0));
          return;
        } else {
          fetchRedirectIds.add(key);
          updateFetcherState(key, getLoadingFetcher(submission));
          return startRedirectNavigation(state, actionResult, {
            fetcherSubmission: submission
          });
        }
      }
      if (isErrorResult(actionResult)) {
        setFetcherError(key, routeId, actionResult.error);
        return;
      }
    }
    if (isDeferredResult(actionResult)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    let nextLocation = state.navigation.location || state.location;
    let revalidationRequest = createClientSideRequest(init.history, nextLocation, abortController.signal);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let matches = state.navigation.state !== "idle" ? matchRoutes(routesToUse, state.navigation.location, basename) : state.matches;
    invariant(matches, "Didn't find any matches after fetcher action");
    let loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let loadFetcher = getLoadingFetcher(submission, actionResult.data);
    state.fetchers.set(key, loadFetcher);
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(
      init.history,
      state,
      matches,
      submission,
      nextLocation,
      false,
      isRevalidationRequired,
      cancelledDeferredRoutes,
      cancelledFetcherLoads,
      deletedFetchers,
      fetchLoadMatches,
      fetchRedirectIds,
      routesToUse,
      basename,
      {
        [match.route.id]: actionResult.data
      },
      void 0
      // No need to send through errors since we short circuit above
    );
    revalidatingFetchers.filter((rf) => rf.key !== key).forEach((rf) => {
      let staleKey = rf.key;
      let existingFetcher2 = state.fetchers.get(staleKey);
      let revalidatingFetcher = getLoadingFetcher(void 0, existingFetcher2 ? existingFetcher2.data : void 0);
      state.fetchers.set(staleKey, revalidatingFetcher);
      if (fetchControllers.has(staleKey)) {
        abortFetcher(staleKey);
      }
      if (rf.controller) {
        fetchControllers.set(staleKey, rf.controller);
      }
    });
    updateState({
      fetchers: new Map(state.fetchers)
    });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((rf) => abortFetcher(rf.key));
    abortController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    let {
      results,
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state.matches, matches, matchesToLoad, revalidatingFetchers, revalidationRequest);
    if (abortController.signal.aborted) {
      return;
    }
    abortController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    revalidatingFetchers.forEach((r) => fetchControllers.delete(r.key));
    let redirect4 = findRedirect(results);
    if (redirect4) {
      if (redirect4.idx >= matchesToLoad.length) {
        let fetcherKey = revalidatingFetchers[redirect4.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      return startRedirectNavigation(state, redirect4.result);
    }
    let {
      loaderData,
      errors
    } = processLoaderData(state, state.matches, matchesToLoad, loaderResults, void 0, revalidatingFetchers, fetcherResults, activeDeferreds);
    if (state.fetchers.has(key)) {
      let doneFetcher = getDoneFetcher(actionResult.data);
      state.fetchers.set(key, doneFetcher);
    }
    abortStaleFetchLoads(loadId);
    if (state.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
      invariant(pendingAction, "Expected pending action");
      pendingNavigationController && pendingNavigationController.abort();
      completeNavigation(state.navigation.location, {
        matches,
        loaderData,
        errors,
        fetchers: new Map(state.fetchers)
      });
    } else {
      updateState({
        errors,
        loaderData: mergeLoaderData(state.loaderData, loaderData, matches, errors),
        fetchers: new Map(state.fetchers)
      });
      isRevalidationRequired = false;
    }
  }
  async function handleFetcherLoader(key, routeId, path, match, matches, flushSync, submission) {
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getLoadingFetcher(submission, existingFetcher ? existingFetcher.data : void 0), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal);
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let result = await callLoaderOrAction("loader", fetchRequest, match, matches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath);
    if (isDeferredResult(result)) {
      result = await resolveDeferredData(result, fetchRequest.signal, true) || result;
    }
    if (fetchControllers.get(key) === abortController) {
      fetchControllers.delete(key);
    }
    if (fetchRequest.signal.aborted) {
      return;
    }
    if (deletedFetchers.has(key)) {
      updateFetcherState(key, getDoneFetcher(void 0));
      return;
    }
    if (isRedirectResult(result)) {
      if (pendingNavigationLoadId > originatingLoadId) {
        updateFetcherState(key, getDoneFetcher(void 0));
        return;
      } else {
        fetchRedirectIds.add(key);
        await startRedirectNavigation(state, result);
        return;
      }
    }
    if (isErrorResult(result)) {
      setFetcherError(key, routeId, result.error);
      return;
    }
    invariant(!isDeferredResult(result), "Unhandled fetcher deferred data");
    updateFetcherState(key, getDoneFetcher(result.data));
  }
  async function startRedirectNavigation(state2, redirect4, _temp2) {
    let {
      submission,
      fetcherSubmission,
      replace
    } = _temp2 === void 0 ? {} : _temp2;
    if (redirect4.revalidate) {
      isRevalidationRequired = true;
    }
    let redirectLocation = createLocation(state2.location, redirect4.location, {
      _isRedirect: true
    });
    invariant(redirectLocation, "Expected a location on the redirect navigation");
    if (isBrowser) {
      let isDocumentReload = false;
      if (redirect4.reloadDocument) {
        isDocumentReload = true;
      } else if (ABSOLUTE_URL_REGEX.test(redirect4.location)) {
        const url = init.history.createURL(redirect4.location);
        isDocumentReload = // Hard reload if it's an absolute URL to a new origin
        url.origin !== routerWindow.location.origin || // Hard reload if it's an absolute URL that does not match our basename
        stripBasename(url.pathname, basename) == null;
      }
      if (isDocumentReload) {
        if (replace) {
          routerWindow.location.replace(redirect4.location);
        } else {
          routerWindow.location.assign(redirect4.location);
        }
        return;
      }
    }
    pendingNavigationController = null;
    let redirectHistoryAction = replace === true ? Action.Replace : Action.Push;
    let {
      formMethod,
      formAction,
      formEncType
    } = state2.navigation;
    if (!submission && !fetcherSubmission && formMethod && formAction && formEncType) {
      submission = getSubmissionFromNavigation(state2.navigation);
    }
    let activeSubmission = submission || fetcherSubmission;
    if (redirectPreserveMethodStatusCodes.has(redirect4.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) {
      await startNavigation(redirectHistoryAction, redirectLocation, {
        submission: _extends({}, activeSubmission, {
          formAction: redirect4.location
        }),
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    } else {
      let overrideNavigation = getLoadingNavigation(redirectLocation, submission);
      await startNavigation(redirectHistoryAction, redirectLocation, {
        overrideNavigation,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission,
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    }
  }
  async function callLoadersAndMaybeResolveData(currentMatches, matches, matchesToLoad, fetchersToLoad, request) {
    let results = await Promise.all([...matchesToLoad.map((match) => callLoaderOrAction("loader", request, match, matches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath)), ...fetchersToLoad.map((f2) => {
      if (f2.matches && f2.match && f2.controller) {
        return callLoaderOrAction("loader", createClientSideRequest(init.history, f2.path, f2.controller.signal), f2.match, f2.matches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath);
      } else {
        let error = {
          type: ResultType.error,
          error: getInternalRouterError(404, {
            pathname: f2.path
          })
        };
        return error;
      }
    })]);
    let loaderResults = results.slice(0, matchesToLoad.length);
    let fetcherResults = results.slice(matchesToLoad.length);
    await Promise.all([resolveDeferredResults(currentMatches, matchesToLoad, loaderResults, loaderResults.map(() => request.signal), false, state.loaderData), resolveDeferredResults(currentMatches, fetchersToLoad.map((f2) => f2.match), fetcherResults, fetchersToLoad.map((f2) => f2.controller ? f2.controller.signal : null), true)]);
    return {
      results,
      loaderResults,
      fetcherResults
    };
  }
  function interruptActiveLoads() {
    isRevalidationRequired = true;
    cancelledDeferredRoutes.push(...cancelActiveDeferreds());
    fetchLoadMatches.forEach((_, key) => {
      if (fetchControllers.has(key)) {
        cancelledFetcherLoads.push(key);
        abortFetcher(key);
      }
    });
  }
  function updateFetcherState(key, fetcher, opts) {
    if (opts === void 0) {
      opts = {};
    }
    state.fetchers.set(key, fetcher);
    updateState({
      fetchers: new Map(state.fetchers)
    }, {
      flushSync: (opts && opts.flushSync) === true
    });
  }
  function setFetcherError(key, routeId, error, opts) {
    if (opts === void 0) {
      opts = {};
    }
    let boundaryMatch = findNearestBoundary(state.matches, routeId);
    deleteFetcher(key);
    updateState({
      errors: {
        [boundaryMatch.route.id]: error
      },
      fetchers: new Map(state.fetchers)
    }, {
      flushSync: (opts && opts.flushSync) === true
    });
  }
  function getFetcher(key) {
    if (future.v7_fetcherPersist) {
      activeFetchers.set(key, (activeFetchers.get(key) || 0) + 1);
      if (deletedFetchers.has(key)) {
        deletedFetchers.delete(key);
      }
    }
    return state.fetchers.get(key) || IDLE_FETCHER;
  }
  function deleteFetcher(key) {
    let fetcher = state.fetchers.get(key);
    if (fetchControllers.has(key) && !(fetcher && fetcher.state === "loading" && fetchReloadIds.has(key))) {
      abortFetcher(key);
    }
    fetchLoadMatches.delete(key);
    fetchReloadIds.delete(key);
    fetchRedirectIds.delete(key);
    deletedFetchers.delete(key);
    state.fetchers.delete(key);
  }
  function deleteFetcherAndUpdateState(key) {
    if (future.v7_fetcherPersist) {
      let count = (activeFetchers.get(key) || 0) - 1;
      if (count <= 0) {
        activeFetchers.delete(key);
        deletedFetchers.add(key);
      } else {
        activeFetchers.set(key, count);
      }
    } else {
      deleteFetcher(key);
    }
    updateState({
      fetchers: new Map(state.fetchers)
    });
  }
  function abortFetcher(key) {
    let controller = fetchControllers.get(key);
    invariant(controller, "Expected fetch controller: " + key);
    controller.abort();
    fetchControllers.delete(key);
  }
  function markFetchersDone(keys2) {
    for (let key of keys2) {
      let fetcher = getFetcher(key);
      let doneFetcher = getDoneFetcher(fetcher.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    let updatedFetchers = false;
    for (let key of fetchRedirectIds) {
      let fetcher = state.fetchers.get(key);
      invariant(fetcher, "Expected fetcher: " + key);
      if (fetcher.state === "loading") {
        fetchRedirectIds.delete(key);
        doneKeys.push(key);
        updatedFetchers = true;
      }
    }
    markFetchersDone(doneKeys);
    return updatedFetchers;
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id] of fetchReloadIds) {
      if (id < landedId) {
        let fetcher = state.fetchers.get(key);
        invariant(fetcher, "Expected fetcher: " + key);
        if (fetcher.state === "loading") {
          abortFetcher(key);
          fetchReloadIds.delete(key);
          yeetedKeys.push(key);
        }
      }
    }
    markFetchersDone(yeetedKeys);
    return yeetedKeys.length > 0;
  }
  function getBlocker(key, fn) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    if (blockerFunctions.get(key) !== fn) {
      blockerFunctions.set(key, fn);
    }
    return blocker;
  }
  function deleteBlocker(key) {
    state.blockers.delete(key);
    blockerFunctions.delete(key);
  }
  function updateBlocker(key, newBlocker) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    invariant(blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked", "Invalid blocker state transition: " + blocker.state + " -> " + newBlocker.state);
    let blockers = new Map(state.blockers);
    blockers.set(key, newBlocker);
    updateState({
      blockers
    });
  }
  function shouldBlockNavigation(_ref2) {
    let {
      currentLocation,
      nextLocation,
      historyAction
    } = _ref2;
    if (blockerFunctions.size === 0) {
      return;
    }
    if (blockerFunctions.size > 1) {
      warning(false, "A router only supports one blocker at a time");
    }
    let entries = Array.from(blockerFunctions.entries());
    let [blockerKey, blockerFunction] = entries[entries.length - 1];
    let blocker = state.blockers.get(blockerKey);
    if (blocker && blocker.state === "proceeding") {
      return;
    }
    if (blockerFunction({
      currentLocation,
      nextLocation,
      historyAction
    })) {
      return blockerKey;
    }
  }
  function cancelActiveDeferreds(predicate) {
    let cancelledRouteIds = [];
    activeDeferreds.forEach((dfd, routeId) => {
      if (!predicate || predicate(routeId)) {
        dfd.cancel();
        cancelledRouteIds.push(routeId);
        activeDeferreds.delete(routeId);
      }
    });
    return cancelledRouteIds;
  }
  function enableScrollRestoration(positions, getPosition, getKey) {
    savedScrollPositions = positions;
    getScrollPosition = getPosition;
    getScrollRestorationKey = getKey || null;
    if (!initialScrollRestored && state.navigation === IDLE_NAVIGATION) {
      initialScrollRestored = true;
      let y2 = getSavedScrollPosition(state.location, state.matches);
      if (y2 != null) {
        updateState({
          restoreScrollPosition: y2
        });
      }
    }
    return () => {
      savedScrollPositions = null;
      getScrollPosition = null;
      getScrollRestorationKey = null;
    };
  }
  function getScrollKey(location2, matches) {
    if (getScrollRestorationKey) {
      let key = getScrollRestorationKey(location2, matches.map((m) => convertRouteMatchToUiMatch(m, state.loaderData)));
      return key || location2.key;
    }
    return location2.key;
  }
  function saveScrollPosition(location2, matches) {
    if (savedScrollPositions && getScrollPosition) {
      let key = getScrollKey(location2, matches);
      savedScrollPositions[key] = getScrollPosition();
    }
  }
  function getSavedScrollPosition(location2, matches) {
    if (savedScrollPositions) {
      let key = getScrollKey(location2, matches);
      let y2 = savedScrollPositions[key];
      if (typeof y2 === "number") {
        return y2;
      }
    }
    return null;
  }
  function _internalSetRoutes(newRoutes) {
    manifest = {};
    inFlightDataRoutes = convertRoutesToDataRoutes(newRoutes, mapRouteProperties, void 0, manifest);
  }
  router = {
    get basename() {
      return basename;
    },
    get future() {
      return future;
    },
    get state() {
      return state;
    },
    get routes() {
      return dataRoutes;
    },
    get window() {
      return routerWindow;
    },
    initialize,
    subscribe,
    enableScrollRestoration,
    navigate,
    fetch: fetch2,
    revalidate,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: (to) => init.history.createHref(to),
    encodeLocation: (to) => init.history.encodeLocation(to),
    getFetcher,
    deleteFetcher: deleteFetcherAndUpdateState,
    dispose,
    getBlocker,
    deleteBlocker,
    _internalFetchControllers: fetchControllers,
    _internalActiveDeferreds: activeDeferreds,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes
  };
  return router;
}
function createStaticHandler(routes2, opts) {
  invariant(routes2.length > 0, "You must provide a non-empty routes array to createStaticHandler");
  let manifest = {};
  let basename = (opts ? opts.basename : null) || "/";
  let mapRouteProperties;
  if (opts != null && opts.mapRouteProperties) {
    mapRouteProperties = opts.mapRouteProperties;
  } else if (opts != null && opts.detectErrorBoundary) {
    let detectErrorBoundary = opts.detectErrorBoundary;
    mapRouteProperties = (route) => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  let future = _extends({
    v7_relativeSplatPath: false
  }, opts ? opts.future : null);
  let dataRoutes = convertRoutesToDataRoutes(routes2, mapRouteProperties, void 0, manifest);
  async function query(request, _temp3) {
    let {
      requestContext
    } = _temp3 === void 0 ? {} : _temp3;
    let url = new URL(request.url);
    let method = request.method;
    let location2 = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location2, basename);
    if (!isValidMethod(method) && method !== "HEAD") {
      let error = getInternalRouterError(405, {
        method
      });
      let {
        matches: methodNotAllowedMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      return {
        basename,
        location: location2,
        matches: methodNotAllowedMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    } else if (!matches) {
      let error = getInternalRouterError(404, {
        pathname: location2.pathname
      });
      let {
        matches: notFoundMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      return {
        basename,
        location: location2,
        matches: notFoundMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    }
    let result = await queryImpl(request, location2, matches, requestContext);
    if (isResponse(result)) {
      return result;
    }
    return _extends({
      location: location2,
      basename
    }, result);
  }
  async function queryRoute(request, _temp4) {
    let {
      routeId,
      requestContext
    } = _temp4 === void 0 ? {} : _temp4;
    let url = new URL(request.url);
    let method = request.method;
    let location2 = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location2, basename);
    if (!isValidMethod(method) && method !== "HEAD" && method !== "OPTIONS") {
      throw getInternalRouterError(405, {
        method
      });
    } else if (!matches) {
      throw getInternalRouterError(404, {
        pathname: location2.pathname
      });
    }
    let match = routeId ? matches.find((m) => m.route.id === routeId) : getTargetMatch(matches, location2);
    if (routeId && !match) {
      throw getInternalRouterError(403, {
        pathname: location2.pathname,
        routeId
      });
    } else if (!match) {
      throw getInternalRouterError(404, {
        pathname: location2.pathname
      });
    }
    let result = await queryImpl(request, location2, matches, requestContext, match);
    if (isResponse(result)) {
      return result;
    }
    let error = result.errors ? Object.values(result.errors)[0] : void 0;
    if (error !== void 0) {
      throw error;
    }
    if (result.actionData) {
      return Object.values(result.actionData)[0];
    }
    if (result.loaderData) {
      var _result$activeDeferre;
      let data = Object.values(result.loaderData)[0];
      if ((_result$activeDeferre = result.activeDeferreds) != null && _result$activeDeferre[match.route.id]) {
        data[UNSAFE_DEFERRED_SYMBOL] = result.activeDeferreds[match.route.id];
      }
      return data;
    }
    return void 0;
  }
  async function queryImpl(request, location2, matches, requestContext, routeMatch) {
    invariant(request.signal, "query()/queryRoute() requests must contain an AbortController signal");
    try {
      if (isMutationMethod(request.method.toLowerCase())) {
        let result2 = await submit(request, matches, routeMatch || getTargetMatch(matches, location2), requestContext, routeMatch != null);
        return result2;
      }
      let result = await loadRouteData(request, matches, requestContext, routeMatch);
      return isResponse(result) ? result : _extends({}, result, {
        actionData: null,
        actionHeaders: {}
      });
    } catch (e) {
      if (isQueryRouteResponse(e)) {
        if (e.type === ResultType.error) {
          throw e.response;
        }
        return e.response;
      }
      if (isRedirectResponse(e)) {
        return e;
      }
      throw e;
    }
  }
  async function submit(request, matches, actionMatch, requestContext, isRouteRequest) {
    let result;
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      let error = getInternalRouterError(405, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: actionMatch.route.id
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: ResultType.error,
        error
      };
    } else {
      result = await callLoaderOrAction("action", request, actionMatch, matches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath, {
        isStaticRequest: true,
        isRouteRequest,
        requestContext
      });
      if (request.signal.aborted) {
        let method = isRouteRequest ? "queryRoute" : "query";
        throw new Error(method + "() call aborted: " + request.method + " " + request.url);
      }
    }
    if (isRedirectResult(result)) {
      throw new Response(null, {
        status: result.status,
        headers: {
          Location: result.location
        }
      });
    }
    if (isDeferredResult(result)) {
      let error = getInternalRouterError(400, {
        type: "defer-action"
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: ResultType.error,
        error
      };
    }
    if (isRouteRequest) {
      if (isErrorResult(result)) {
        throw result.error;
      }
      return {
        matches: [actionMatch],
        loaderData: {},
        actionData: {
          [actionMatch.route.id]: result.data
        },
        errors: null,
        // Note: statusCode + headers are unused here since queryRoute will
        // return the raw Response or value
        statusCode: 200,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    }
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      let context2 = await loadRouteData(request, matches, requestContext, void 0, {
        [boundaryMatch.route.id]: result.error
      });
      return _extends({}, context2, {
        statusCode: isRouteErrorResponse(result.error) ? result.error.status : 500,
        actionData: null,
        actionHeaders: _extends({}, result.headers ? {
          [actionMatch.route.id]: result.headers
        } : {})
      });
    }
    let loaderRequest = new Request(request.url, {
      headers: request.headers,
      redirect: request.redirect,
      signal: request.signal
    });
    let context = await loadRouteData(loaderRequest, matches, requestContext);
    return _extends({}, context, result.statusCode ? {
      statusCode: result.statusCode
    } : {}, {
      actionData: {
        [actionMatch.route.id]: result.data
      },
      actionHeaders: _extends({}, result.headers ? {
        [actionMatch.route.id]: result.headers
      } : {})
    });
  }
  async function loadRouteData(request, matches, requestContext, routeMatch, pendingActionError) {
    let isRouteRequest = routeMatch != null;
    if (isRouteRequest && !(routeMatch != null && routeMatch.route.loader) && !(routeMatch != null && routeMatch.route.lazy)) {
      throw getInternalRouterError(400, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: routeMatch == null ? void 0 : routeMatch.route.id
      });
    }
    let requestMatches = routeMatch ? [routeMatch] : getLoaderMatchesUntilBoundary(matches, Object.keys(pendingActionError || {})[0]);
    let matchesToLoad = requestMatches.filter((m) => m.route.loader || m.route.lazy);
    if (matchesToLoad.length === 0) {
      return {
        matches,
        // Add a null for all matched routes for proper revalidation on the client
        loaderData: matches.reduce((acc, m) => Object.assign(acc, {
          [m.route.id]: null
        }), {}),
        errors: pendingActionError || null,
        statusCode: 200,
        loaderHeaders: {},
        activeDeferreds: null
      };
    }
    let results = await Promise.all([...matchesToLoad.map((match) => callLoaderOrAction("loader", request, match, matches, manifest, mapRouteProperties, basename, future.v7_relativeSplatPath, {
      isStaticRequest: true,
      isRouteRequest,
      requestContext
    }))]);
    if (request.signal.aborted) {
      let method = isRouteRequest ? "queryRoute" : "query";
      throw new Error(method + "() call aborted: " + request.method + " " + request.url);
    }
    let activeDeferreds = /* @__PURE__ */ new Map();
    let context = processRouteLoaderData(matches, matchesToLoad, results, pendingActionError, activeDeferreds);
    let executedLoaders = new Set(matchesToLoad.map((match) => match.route.id));
    matches.forEach((match) => {
      if (!executedLoaders.has(match.route.id)) {
        context.loaderData[match.route.id] = null;
      }
    });
    return _extends({}, context, {
      matches,
      activeDeferreds: activeDeferreds.size > 0 ? Object.fromEntries(activeDeferreds.entries()) : null
    });
  }
  return {
    dataRoutes,
    query,
    queryRoute
  };
}
function getStaticContextFromError(routes2, context, error) {
  let newContext = _extends({}, context, {
    statusCode: 500,
    errors: {
      [context._deepestRenderedBoundaryId || routes2[0].id]: error
    }
  });
  return newContext;
}
function isSubmissionNavigation(opts) {
  return opts != null && ("formData" in opts && opts.formData != null || "body" in opts && opts.body !== void 0);
}
function normalizeTo(location2, matches, basename, prependBasename, to, v7_relativeSplatPath, fromRouteId, relative) {
  let contextualMatches;
  let activeRouteMatch;
  if (fromRouteId) {
    contextualMatches = [];
    for (let match of matches) {
      contextualMatches.push(match);
      if (match.route.id === fromRouteId) {
        activeRouteMatch = match;
        break;
      }
    }
  } else {
    contextualMatches = matches;
    activeRouteMatch = matches[matches.length - 1];
  }
  let path = resolveTo(to ? to : ".", getResolveToMatches(contextualMatches, v7_relativeSplatPath), stripBasename(location2.pathname, basename) || location2.pathname, relative === "path");
  if (to == null) {
    path.search = location2.search;
    path.hash = location2.hash;
  }
  if ((to == null || to === "" || to === ".") && activeRouteMatch && activeRouteMatch.route.index && !hasNakedIndexQuery(path.search)) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (prependBasename && basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
function normalizeNavigateOptions(normalizeFormMethod, isFetcher, path, opts) {
  if (!opts || !isSubmissionNavigation(opts)) {
    return {
      path
    };
  }
  if (opts.formMethod && !isValidMethod(opts.formMethod)) {
    return {
      path,
      error: getInternalRouterError(405, {
        method: opts.formMethod
      })
    };
  }
  let getInvalidBodyError = () => ({
    path,
    error: getInternalRouterError(400, {
      type: "invalid-body"
    })
  });
  let rawFormMethod = opts.formMethod || "get";
  let formMethod = normalizeFormMethod ? rawFormMethod.toUpperCase() : rawFormMethod.toLowerCase();
  let formAction = stripHashFromPath(path);
  if (opts.body !== void 0) {
    if (opts.formEncType === "text/plain") {
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      let text = typeof opts.body === "string" ? opts.body : opts.body instanceof FormData || opts.body instanceof URLSearchParams ? (
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
        Array.from(opts.body.entries()).reduce((acc, _ref3) => {
          let [name, value] = _ref3;
          return "" + acc + name + "=" + value + "\n";
        }, "")
      ) : String(opts.body);
      return {
        path,
        submission: {
          formMethod,
          formAction,
          formEncType: opts.formEncType,
          formData: void 0,
          json: void 0,
          text
        }
      };
    } else if (opts.formEncType === "application/json") {
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      try {
        let json5 = typeof opts.body === "string" ? JSON.parse(opts.body) : opts.body;
        return {
          path,
          submission: {
            formMethod,
            formAction,
            formEncType: opts.formEncType,
            formData: void 0,
            json: json5,
            text: void 0
          }
        };
      } catch (e) {
        return getInvalidBodyError();
      }
    }
  }
  invariant(typeof FormData === "function", "FormData is not available in this environment");
  let searchParams;
  let formData;
  if (opts.formData) {
    searchParams = convertFormDataToSearchParams(opts.formData);
    formData = opts.formData;
  } else if (opts.body instanceof FormData) {
    searchParams = convertFormDataToSearchParams(opts.body);
    formData = opts.body;
  } else if (opts.body instanceof URLSearchParams) {
    searchParams = opts.body;
    formData = convertSearchParamsToFormData(searchParams);
  } else if (opts.body == null) {
    searchParams = new URLSearchParams();
    formData = new FormData();
  } else {
    try {
      searchParams = new URLSearchParams(opts.body);
      formData = convertSearchParamsToFormData(searchParams);
    } catch (e) {
      return getInvalidBodyError();
    }
  }
  let submission = {
    formMethod,
    formAction,
    formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
    formData,
    json: void 0,
    text: void 0
  };
  if (isMutationMethod(submission.formMethod)) {
    return {
      path,
      submission
    };
  }
  let parsedPath = parsePath(path);
  if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) {
    searchParams.append("index", "");
  }
  parsedPath.search = "?" + searchParams;
  return {
    path: createPath(parsedPath),
    submission
  };
}
function getLoaderMatchesUntilBoundary(matches, boundaryId) {
  let boundaryMatches = matches;
  if (boundaryId) {
    let index = matches.findIndex((m) => m.route.id === boundaryId);
    if (index >= 0) {
      boundaryMatches = matches.slice(0, index);
    }
  }
  return boundaryMatches;
}
function getMatchesToLoad(history, state, matches, submission, location2, isInitialLoad, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionData, pendingError) {
  let actionResult = pendingError ? Object.values(pendingError)[0] : pendingActionData ? Object.values(pendingActionData)[0] : void 0;
  let currentUrl = history.createURL(state.location);
  let nextUrl = history.createURL(location2);
  let boundaryId = pendingError ? Object.keys(pendingError)[0] : void 0;
  let boundaryMatches = getLoaderMatchesUntilBoundary(matches, boundaryId);
  let navigationMatches = boundaryMatches.filter((match, index) => {
    let {
      route
    } = match;
    if (route.lazy) {
      return true;
    }
    if (route.loader == null) {
      return false;
    }
    if (isInitialLoad) {
      if (route.loader.hydrate) {
        return true;
      }
      return state.loaderData[route.id] === void 0 && // Don't re-run if the loader ran and threw an error
      (!state.errors || state.errors[route.id] === void 0);
    }
    if (isNewLoader(state.loaderData, state.matches[index], match) || cancelledDeferredRoutes.some((id) => id === match.route.id)) {
      return true;
    }
    let currentRouteMatch = state.matches[index];
    let nextRouteMatch = match;
    return shouldRevalidateLoader(match, _extends({
      currentUrl,
      currentParams: currentRouteMatch.params,
      nextUrl,
      nextParams: nextRouteMatch.params
    }, submission, {
      actionResult,
      defaultShouldRevalidate: (
        // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
        isRevalidationRequired || // Clicked the same link, resubmitted a GET form
        currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search || // Search params affect all loaders
        currentUrl.search !== nextUrl.search || isNewRouteInstance(currentRouteMatch, nextRouteMatch)
      )
    }));
  });
  let revalidatingFetchers = [];
  fetchLoadMatches.forEach((f2, key) => {
    if (isInitialLoad || !matches.some((m) => m.route.id === f2.routeId) || deletedFetchers.has(key)) {
      return;
    }
    let fetcherMatches = matchRoutes(routesToUse, f2.path, basename);
    if (!fetcherMatches) {
      revalidatingFetchers.push({
        key,
        routeId: f2.routeId,
        path: f2.path,
        matches: null,
        match: null,
        controller: null
      });
      return;
    }
    let fetcher = state.fetchers.get(key);
    let fetcherMatch = getTargetMatch(fetcherMatches, f2.path);
    let shouldRevalidate = false;
    if (fetchRedirectIds.has(key)) {
      shouldRevalidate = false;
    } else if (cancelledFetcherLoads.includes(key)) {
      shouldRevalidate = true;
    } else if (fetcher && fetcher.state !== "idle" && fetcher.data === void 0) {
      shouldRevalidate = isRevalidationRequired;
    } else {
      shouldRevalidate = shouldRevalidateLoader(fetcherMatch, _extends({
        currentUrl,
        currentParams: state.matches[state.matches.length - 1].params,
        nextUrl,
        nextParams: matches[matches.length - 1].params
      }, submission, {
        actionResult,
        defaultShouldRevalidate: isRevalidationRequired
      }));
    }
    if (shouldRevalidate) {
      revalidatingFetchers.push({
        key,
        routeId: f2.routeId,
        path: f2.path,
        matches: fetcherMatches,
        match: fetcherMatch,
        controller: new AbortController()
      });
    }
  });
  return [navigationMatches, revalidatingFetchers];
}
function isNewLoader(currentLoaderData, currentMatch, match) {
  let isNew = (
    // [a] -> [a, b]
    !currentMatch || // [a, b] -> [a, c]
    match.route.id !== currentMatch.route.id
  );
  let isMissingData = currentLoaderData[match.route.id] === void 0;
  return isNew || isMissingData;
}
function isNewRouteInstance(currentMatch, match) {
  let currentPath = currentMatch.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    currentMatch.pathname !== match.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"]
  );
}
function shouldRevalidateLoader(loaderMatch, arg) {
  if (loaderMatch.route.shouldRevalidate) {
    let routeChoice = loaderMatch.route.shouldRevalidate(arg);
    if (typeof routeChoice === "boolean") {
      return routeChoice;
    }
  }
  return arg.defaultShouldRevalidate;
}
async function loadLazyRouteModule(route, mapRouteProperties, manifest) {
  if (!route.lazy) {
    return;
  }
  let lazyRoute = await route.lazy();
  if (!route.lazy) {
    return;
  }
  let routeToUpdate = manifest[route.id];
  invariant(routeToUpdate, "No route found in manifest");
  let routeUpdates = {};
  for (let lazyRouteProperty in lazyRoute) {
    let staticRouteValue = routeToUpdate[lazyRouteProperty];
    let isPropertyStaticallyDefined = staticRouteValue !== void 0 && // This property isn't static since it should always be updated based
    // on the route updates
    lazyRouteProperty !== "hasErrorBoundary";
    warning(!isPropertyStaticallyDefined, 'Route "' + routeToUpdate.id + '" has a static property "' + lazyRouteProperty + '" defined but its lazy function is also returning a value for this property. ' + ('The lazy route property "' + lazyRouteProperty + '" will be ignored.'));
    if (!isPropertyStaticallyDefined && !immutableRouteKeys.has(lazyRouteProperty)) {
      routeUpdates[lazyRouteProperty] = lazyRoute[lazyRouteProperty];
    }
  }
  Object.assign(routeToUpdate, routeUpdates);
  Object.assign(routeToUpdate, _extends({}, mapRouteProperties(routeToUpdate), {
    lazy: void 0
  }));
}
async function callLoaderOrAction(type2, request, match, matches, manifest, mapRouteProperties, basename, v7_relativeSplatPath, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let resultType;
  let result;
  let onReject;
  let runHandler = (handler) => {
    let reject;
    let abortPromise = new Promise((_, r) => reject = r);
    onReject = () => reject();
    request.signal.addEventListener("abort", onReject);
    return Promise.race([handler({
      request,
      params: match.params,
      context: opts.requestContext
    }), abortPromise]);
  };
  try {
    let handler = match.route[type2];
    if (match.route.lazy) {
      if (handler) {
        let handlerError;
        let values = await Promise.all([
          // If the handler throws, don't let it immediately bubble out,
          // since we need to let the lazy() execution finish so we know if this
          // route has a boundary that can handle the error
          runHandler(handler).catch((e) => {
            handlerError = e;
          }),
          loadLazyRouteModule(match.route, mapRouteProperties, manifest)
        ]);
        if (handlerError) {
          throw handlerError;
        }
        result = values[0];
      } else {
        await loadLazyRouteModule(match.route, mapRouteProperties, manifest);
        handler = match.route[type2];
        if (handler) {
          result = await runHandler(handler);
        } else if (type2 === "action") {
          let url = new URL(request.url);
          let pathname = url.pathname + url.search;
          throw getInternalRouterError(405, {
            method: request.method,
            pathname,
            routeId: match.route.id
          });
        } else {
          return {
            type: ResultType.data,
            data: void 0
          };
        }
      }
    } else if (!handler) {
      let url = new URL(request.url);
      let pathname = url.pathname + url.search;
      throw getInternalRouterError(404, {
        pathname
      });
    } else {
      result = await runHandler(handler);
    }
    invariant(result !== void 0, "You defined " + (type2 === "action" ? "an action" : "a loader") + " for route " + ('"' + match.route.id + "\" but didn't return anything from your `" + type2 + "` ") + "function. Please return a value or `null`.");
  } catch (e) {
    resultType = ResultType.error;
    result = e;
  } finally {
    if (onReject) {
      request.signal.removeEventListener("abort", onReject);
    }
  }
  if (isResponse(result)) {
    let status = result.status;
    if (redirectStatusCodes.has(status)) {
      let location2 = result.headers.get("Location");
      invariant(location2, "Redirects returned/thrown from loaders/actions must have a Location header");
      if (!ABSOLUTE_URL_REGEX.test(location2)) {
        location2 = normalizeTo(new URL(request.url), matches.slice(0, matches.indexOf(match) + 1), basename, true, location2, v7_relativeSplatPath);
      } else if (!opts.isStaticRequest) {
        let currentUrl = new URL(request.url);
        let url = location2.startsWith("//") ? new URL(currentUrl.protocol + location2) : new URL(location2);
        let isSameBasename = stripBasename(url.pathname, basename) != null;
        if (url.origin === currentUrl.origin && isSameBasename) {
          location2 = url.pathname + url.search + url.hash;
        }
      }
      if (opts.isStaticRequest) {
        result.headers.set("Location", location2);
        throw result;
      }
      return {
        type: ResultType.redirect,
        status,
        location: location2,
        revalidate: result.headers.get("X-Remix-Revalidate") !== null,
        reloadDocument: result.headers.get("X-Remix-Reload-Document") !== null
      };
    }
    if (opts.isRouteRequest) {
      let queryRouteResponse = {
        type: resultType === ResultType.error ? ResultType.error : ResultType.data,
        response: result
      };
      throw queryRouteResponse;
    }
    let data;
    try {
      let contentType = result.headers.get("Content-Type");
      if (contentType && /\bapplication\/json\b/.test(contentType)) {
        if (result.body == null) {
          data = null;
        } else {
          data = await result.json();
        }
      } else {
        data = await result.text();
      }
    } catch (e) {
      return {
        type: ResultType.error,
        error: e
      };
    }
    if (resultType === ResultType.error) {
      return {
        type: resultType,
        error: new ErrorResponseImpl(status, result.statusText, data),
        headers: result.headers
      };
    }
    return {
      type: ResultType.data,
      data,
      statusCode: result.status,
      headers: result.headers
    };
  }
  if (resultType === ResultType.error) {
    return {
      type: resultType,
      error: result
    };
  }
  if (isDeferredData(result)) {
    var _result$init, _result$init2;
    return {
      type: ResultType.deferred,
      deferredData: result,
      statusCode: (_result$init = result.init) == null ? void 0 : _result$init.status,
      headers: ((_result$init2 = result.init) == null ? void 0 : _result$init2.headers) && new Headers(result.init.headers)
    };
  }
  return {
    type: ResultType.data,
    data: result
  };
}
function createClientSideRequest(history, location2, signal, submission) {
  let url = history.createURL(stripHashFromPath(location2)).toString();
  let init = {
    signal
  };
  if (submission && isMutationMethod(submission.formMethod)) {
    let {
      formMethod,
      formEncType
    } = submission;
    init.method = formMethod.toUpperCase();
    if (formEncType === "application/json") {
      init.headers = new Headers({
        "Content-Type": formEncType
      });
      init.body = JSON.stringify(submission.json);
    } else if (formEncType === "text/plain") {
      init.body = submission.text;
    } else if (formEncType === "application/x-www-form-urlencoded" && submission.formData) {
      init.body = convertFormDataToSearchParams(submission.formData);
    } else {
      init.body = submission.formData;
    }
  }
  return new Request(url, init);
}
function convertFormDataToSearchParams(formData) {
  let searchParams = new URLSearchParams();
  for (let [key, value] of formData.entries()) {
    searchParams.append(key, typeof value === "string" ? value : value.name);
  }
  return searchParams;
}
function convertSearchParamsToFormData(searchParams) {
  let formData = new FormData();
  for (let [key, value] of searchParams.entries()) {
    formData.append(key, value);
  }
  return formData;
}
function processRouteLoaderData(matches, matchesToLoad, results, pendingError, activeDeferreds) {
  let loaderData = {};
  let errors = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  results.forEach((result, index) => {
    let id = matchesToLoad[index].route.id;
    invariant(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(matches, id);
      let error = result.error;
      if (pendingError) {
        error = Object.values(pendingError)[0];
        pendingError = void 0;
      }
      errors = errors || {};
      if (errors[boundaryMatch.route.id] == null) {
        errors[boundaryMatch.route.id] = error;
      }
      loaderData[id] = void 0;
      if (!foundError) {
        foundError = true;
        statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    } else {
      if (isDeferredResult(result)) {
        activeDeferreds.set(id, result.deferredData);
        loaderData[id] = result.deferredData.data;
      } else {
        loaderData[id] = result.data;
      }
      if (result.statusCode != null && result.statusCode !== 200 && !foundError) {
        statusCode = result.statusCode;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    }
  });
  if (pendingError) {
    errors = pendingError;
    loaderData[Object.keys(pendingError)[0]] = void 0;
  }
  return {
    loaderData,
    errors,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function processLoaderData(state, matches, matchesToLoad, results, pendingError, revalidatingFetchers, fetcherResults, activeDeferreds) {
  let {
    loaderData,
    errors
  } = processRouteLoaderData(matches, matchesToLoad, results, pendingError, activeDeferreds);
  for (let index = 0; index < revalidatingFetchers.length; index++) {
    let {
      key,
      match,
      controller
    } = revalidatingFetchers[index];
    invariant(fetcherResults !== void 0 && fetcherResults[index] !== void 0, "Did not find corresponding fetcher result");
    let result = fetcherResults[index];
    if (controller && controller.signal.aborted) {
      continue;
    } else if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state.matches, match == null ? void 0 : match.route.id);
      if (!(errors && errors[boundaryMatch.route.id])) {
        errors = _extends({}, errors, {
          [boundaryMatch.route.id]: result.error
        });
      }
      state.fetchers.delete(key);
    } else if (isRedirectResult(result)) {
      invariant(false, "Unhandled fetcher revalidation redirect");
    } else if (isDeferredResult(result)) {
      invariant(false, "Unhandled fetcher deferred data");
    } else {
      let doneFetcher = getDoneFetcher(result.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  return {
    loaderData,
    errors
  };
}
function mergeLoaderData(loaderData, newLoaderData, matches, errors) {
  let mergedLoaderData = _extends({}, newLoaderData);
  for (let match of matches) {
    let id = match.route.id;
    if (newLoaderData.hasOwnProperty(id)) {
      if (newLoaderData[id] !== void 0) {
        mergedLoaderData[id] = newLoaderData[id];
      }
    } else if (loaderData[id] !== void 0 && match.route.loader) {
      mergedLoaderData[id] = loaderData[id];
    }
    if (errors && errors.hasOwnProperty(id)) {
      break;
    }
  }
  return mergedLoaderData;
}
function findNearestBoundary(matches, routeId) {
  let eligibleMatches = routeId ? matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1) : [...matches];
  return eligibleMatches.reverse().find((m) => m.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes2) {
  let route = routes2.length === 1 ? routes2[0] : routes2.find((r) => r.index || !r.path || r.path === "/") || {
    id: "__shim-error-route__"
  };
  return {
    matches: [{
      params: {},
      pathname: "",
      pathnameBase: "",
      route
    }],
    route
  };
}
function getInternalRouterError(status, _temp5) {
  let {
    pathname,
    routeId,
    method,
    type: type2
  } = _temp5 === void 0 ? {} : _temp5;
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method + ' request to "' + pathname + '" but ' + ('did not provide a `loader` for route "' + routeId + '", ') + "so there is no way to handle the request.";
    } else if (type2 === "defer-action") {
      errorMessage = "defer() is not supported in actions";
    } else if (type2 === "invalid-body") {
      errorMessage = "Unable to encode submission body";
    }
  } else if (status === 403) {
    statusText = "Forbidden";
    errorMessage = 'Route "' + routeId + '" does not match URL "' + pathname + '"';
  } else if (status === 404) {
    statusText = "Not Found";
    errorMessage = 'No route matches URL "' + pathname + '"';
  } else if (status === 405) {
    statusText = "Method Not Allowed";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method.toUpperCase() + ' request to "' + pathname + '" but ' + ('did not provide an `action` for route "' + routeId + '", ') + "so there is no way to handle the request.";
    } else if (method) {
      errorMessage = 'Invalid request method "' + method.toUpperCase() + '"';
    }
  }
  return new ErrorResponseImpl(status || 500, statusText, new Error(errorMessage), true);
}
function findRedirect(results) {
  for (let i = results.length - 1; i >= 0; i--) {
    let result = results[i];
    if (isRedirectResult(result)) {
      return {
        result,
        idx: i
      };
    }
  }
}
function stripHashFromPath(path) {
  let parsedPath = typeof path === "string" ? parsePath(path) : path;
  return createPath(_extends({}, parsedPath, {
    hash: ""
  }));
}
function isHashChangeOnly(a, b2) {
  if (a.pathname !== b2.pathname || a.search !== b2.search) {
    return false;
  }
  if (a.hash === "") {
    return b2.hash !== "";
  } else if (a.hash === b2.hash) {
    return true;
  } else if (b2.hash !== "") {
    return true;
  }
  return false;
}
function isDeferredResult(result) {
  return result.type === ResultType.deferred;
}
function isErrorResult(result) {
  return result.type === ResultType.error;
}
function isRedirectResult(result) {
  return (result && result.type) === ResultType.redirect;
}
function isDeferredData(value) {
  let deferred = value;
  return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isRedirectResponse(result) {
  if (!isResponse(result)) {
    return false;
  }
  let status = result.status;
  let location2 = result.headers.get("Location");
  return status >= 300 && status <= 399 && location2 != null;
}
function isQueryRouteResponse(obj) {
  return obj && isResponse(obj.response) && (obj.type === ResultType.data || obj.type === ResultType.error);
}
function isValidMethod(method) {
  return validRequestMethods.has(method.toLowerCase());
}
function isMutationMethod(method) {
  return validMutationMethods.has(method.toLowerCase());
}
async function resolveDeferredResults(currentMatches, matchesToLoad, results, signals, isFetcher, currentLoaderData) {
  for (let index = 0; index < results.length; index++) {
    let result = results[index];
    let match = matchesToLoad[index];
    if (!match) {
      continue;
    }
    let currentMatch = currentMatches.find((m) => m.route.id === match.route.id);
    let isRevalidatingLoader = currentMatch != null && !isNewRouteInstance(currentMatch, match) && (currentLoaderData && currentLoaderData[match.route.id]) !== void 0;
    if (isDeferredResult(result) && (isFetcher || isRevalidatingLoader)) {
      let signal = signals[index];
      invariant(signal, "Expected an AbortSignal for revalidating fetcher deferred result");
      await resolveDeferredData(result, signal, isFetcher).then((result2) => {
        if (result2) {
          results[index] = result2 || results[index];
        }
      });
    }
  }
}
async function resolveDeferredData(result, signal, unwrap2) {
  if (unwrap2 === void 0) {
    unwrap2 = false;
  }
  let aborted = await result.deferredData.resolveData(signal);
  if (aborted) {
    return;
  }
  if (unwrap2) {
    try {
      return {
        type: ResultType.data,
        data: result.deferredData.unwrappedData
      };
    } catch (e) {
      return {
        type: ResultType.error,
        error: e
      };
    }
  }
  return {
    type: ResultType.data,
    data: result.deferredData.data
  };
}
function hasNakedIndexQuery(search) {
  return new URLSearchParams(search).getAll("index").some((v) => v === "");
}
function getTargetMatch(matches, location2) {
  let search = typeof location2 === "string" ? parsePath(location2).search : location2.search;
  if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
    return matches[matches.length - 1];
  }
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches[pathMatches.length - 1];
}
function getSubmissionFromNavigation(navigation) {
  let {
    formMethod,
    formAction,
    formEncType,
    text,
    formData,
    json: json5
  } = navigation;
  if (!formMethod || !formAction || !formEncType) {
    return;
  }
  if (text != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: void 0,
      json: void 0,
      text
    };
  } else if (formData != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData,
      json: void 0,
      text: void 0
    };
  } else if (json5 !== void 0) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: void 0,
      json: json5,
      text: void 0
    };
  }
}
function getLoadingNavigation(location2, submission) {
  if (submission) {
    let navigation = {
      state: "loading",
      location: location2,
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text
    };
    return navigation;
  } else {
    let navigation = {
      state: "loading",
      location: location2,
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0
    };
    return navigation;
  }
}
function getSubmittingNavigation(location2, submission) {
  let navigation = {
    state: "submitting",
    location: location2,
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text
  };
  return navigation;
}
function getLoadingFetcher(submission, data) {
  if (submission) {
    let fetcher = {
      state: "loading",
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text,
      data
    };
    return fetcher;
  } else {
    let fetcher = {
      state: "loading",
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0,
      data
    };
    return fetcher;
  }
}
function getSubmittingFetcher(submission, existingFetcher) {
  let fetcher = {
    state: "submitting",
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text,
    data: existingFetcher ? existingFetcher.data : void 0
  };
  return fetcher;
}
function getDoneFetcher(data) {
  let fetcher = {
    state: "idle",
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
    data
  };
  return fetcher;
}
function restoreAppliedTransitions(_window, transitions) {
  try {
    let sessionPositions = _window.sessionStorage.getItem(TRANSITIONS_STORAGE_KEY);
    if (sessionPositions) {
      let json5 = JSON.parse(sessionPositions);
      for (let [k2, v] of Object.entries(json5 || {})) {
        if (v && Array.isArray(v)) {
          transitions.set(k2, new Set(v || []));
        }
      }
    }
  } catch (e) {
  }
}
function persistAppliedTransitions(_window, transitions) {
  if (transitions.size > 0) {
    let json5 = {};
    for (let [k2, v] of transitions) {
      json5[k2] = [...v];
    }
    try {
      _window.sessionStorage.setItem(TRANSITIONS_STORAGE_KEY, JSON.stringify(json5));
    } catch (error) {
      warning(false, "Failed to save applied view transitions in sessionStorage (" + error + ").");
    }
  }
}
var Action, PopStateEventType, ResultType, immutableRouteKeys, paramRe, dynamicSegmentValue, indexRouteValue, emptySegmentValue, staticSegmentValue, splatPenalty, isSplat, joinPaths, normalizePathname, normalizeSearch, normalizeHash, json, AbortedDeferredError, DeferredData, defer, redirect, redirectDocument, ErrorResponseImpl, validMutationMethodsArr, validMutationMethods, validRequestMethodsArr, validRequestMethods, redirectStatusCodes, redirectPreserveMethodStatusCodes, IDLE_NAVIGATION, IDLE_FETCHER, IDLE_BLOCKER, ABSOLUTE_URL_REGEX, defaultMapRouteProperties, TRANSITIONS_STORAGE_KEY, UNSAFE_DEFERRED_SYMBOL;
var init_router = __esm({
  "../node_modules/@remix-run/router/dist/router.js"() {
    (function(Action2) {
      Action2["Pop"] = "POP";
      Action2["Push"] = "PUSH";
      Action2["Replace"] = "REPLACE";
    })(Action || (Action = {}));
    PopStateEventType = "popstate";
    (function(ResultType2) {
      ResultType2["data"] = "data";
      ResultType2["deferred"] = "deferred";
      ResultType2["redirect"] = "redirect";
      ResultType2["error"] = "error";
    })(ResultType || (ResultType = {}));
    immutableRouteKeys = /* @__PURE__ */ new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
    paramRe = /^:[\w-]+$/;
    dynamicSegmentValue = 3;
    indexRouteValue = 2;
    emptySegmentValue = 1;
    staticSegmentValue = 10;
    splatPenalty = -2;
    isSplat = (s) => s === "*";
    joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
    normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
    normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
    normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
    json = function json2(data, init) {
      if (init === void 0) {
        init = {};
      }
      let responseInit = typeof init === "number" ? {
        status: init
      } : init;
      let headers = new Headers(responseInit.headers);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json; charset=utf-8");
      }
      return new Response(JSON.stringify(data), _extends({}, responseInit, {
        headers
      }));
    };
    AbortedDeferredError = class extends Error {
    };
    DeferredData = class {
      constructor(data, responseInit) {
        this.pendingKeysSet = /* @__PURE__ */ new Set();
        this.subscribers = /* @__PURE__ */ new Set();
        this.deferredKeys = [];
        invariant(data && typeof data === "object" && !Array.isArray(data), "defer() only accepts plain objects");
        let reject;
        this.abortPromise = new Promise((_, r) => reject = r);
        this.controller = new AbortController();
        let onAbort = () => reject(new AbortedDeferredError("Deferred data aborted"));
        this.unlistenAbortSignal = () => this.controller.signal.removeEventListener("abort", onAbort);
        this.controller.signal.addEventListener("abort", onAbort);
        this.data = Object.entries(data).reduce((acc, _ref2) => {
          let [key, value] = _ref2;
          return Object.assign(acc, {
            [key]: this.trackPromise(key, value)
          });
        }, {});
        if (this.done) {
          this.unlistenAbortSignal();
        }
        this.init = responseInit;
      }
      trackPromise(key, value) {
        if (!(value instanceof Promise)) {
          return value;
        }
        this.deferredKeys.push(key);
        this.pendingKeysSet.add(key);
        let promise = Promise.race([value, this.abortPromise]).then((data) => this.onSettle(promise, key, void 0, data), (error) => this.onSettle(promise, key, error));
        promise.catch(() => {
        });
        Object.defineProperty(promise, "_tracked", {
          get: () => true
        });
        return promise;
      }
      onSettle(promise, key, error, data) {
        if (this.controller.signal.aborted && error instanceof AbortedDeferredError) {
          this.unlistenAbortSignal();
          Object.defineProperty(promise, "_error", {
            get: () => error
          });
          return Promise.reject(error);
        }
        this.pendingKeysSet.delete(key);
        if (this.done) {
          this.unlistenAbortSignal();
        }
        if (error === void 0 && data === void 0) {
          let undefinedError = new Error('Deferred data for key "' + key + '" resolved/rejected with `undefined`, you must resolve/reject with a value or `null`.');
          Object.defineProperty(promise, "_error", {
            get: () => undefinedError
          });
          this.emit(false, key);
          return Promise.reject(undefinedError);
        }
        if (data === void 0) {
          Object.defineProperty(promise, "_error", {
            get: () => error
          });
          this.emit(false, key);
          return Promise.reject(error);
        }
        Object.defineProperty(promise, "_data", {
          get: () => data
        });
        this.emit(false, key);
        return data;
      }
      emit(aborted, settledKey) {
        this.subscribers.forEach((subscriber) => subscriber(aborted, settledKey));
      }
      subscribe(fn) {
        this.subscribers.add(fn);
        return () => this.subscribers.delete(fn);
      }
      cancel() {
        this.controller.abort();
        this.pendingKeysSet.forEach((v, k2) => this.pendingKeysSet.delete(k2));
        this.emit(true);
      }
      async resolveData(signal) {
        let aborted = false;
        if (!this.done) {
          let onAbort = () => this.cancel();
          signal.addEventListener("abort", onAbort);
          aborted = await new Promise((resolve) => {
            this.subscribe((aborted2) => {
              signal.removeEventListener("abort", onAbort);
              if (aborted2 || this.done) {
                resolve(aborted2);
              }
            });
          });
        }
        return aborted;
      }
      get done() {
        return this.pendingKeysSet.size === 0;
      }
      get unwrappedData() {
        invariant(this.data !== null && this.done, "Can only unwrap data on initialized and settled deferreds");
        return Object.entries(this.data).reduce((acc, _ref3) => {
          let [key, value] = _ref3;
          return Object.assign(acc, {
            [key]: unwrapTrackedPromise(value)
          });
        }, {});
      }
      get pendingKeys() {
        return Array.from(this.pendingKeysSet);
      }
    };
    defer = function defer2(data, init) {
      if (init === void 0) {
        init = {};
      }
      let responseInit = typeof init === "number" ? {
        status: init
      } : init;
      return new DeferredData(data, responseInit);
    };
    redirect = function redirect2(url, init) {
      if (init === void 0) {
        init = 302;
      }
      let responseInit = init;
      if (typeof responseInit === "number") {
        responseInit = {
          status: responseInit
        };
      } else if (typeof responseInit.status === "undefined") {
        responseInit.status = 302;
      }
      let headers = new Headers(responseInit.headers);
      headers.set("Location", url);
      return new Response(null, _extends({}, responseInit, {
        headers
      }));
    };
    redirectDocument = (url, init) => {
      let response = redirect(url, init);
      response.headers.set("X-Remix-Reload-Document", "true");
      return response;
    };
    ErrorResponseImpl = class {
      constructor(status, statusText, data, internal) {
        if (internal === void 0) {
          internal = false;
        }
        this.status = status;
        this.statusText = statusText || "";
        this.internal = internal;
        if (data instanceof Error) {
          this.data = data.toString();
          this.error = data;
        } else {
          this.data = data;
        }
      }
    };
    validMutationMethodsArr = ["post", "put", "patch", "delete"];
    validMutationMethods = new Set(validMutationMethodsArr);
    validRequestMethodsArr = ["get", ...validMutationMethodsArr];
    validRequestMethods = new Set(validRequestMethodsArr);
    redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    redirectPreserveMethodStatusCodes = /* @__PURE__ */ new Set([307, 308]);
    IDLE_NAVIGATION = {
      state: "idle",
      location: void 0,
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0
    };
    IDLE_FETCHER = {
      state: "idle",
      data: void 0,
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0
    };
    IDLE_BLOCKER = {
      state: "unblocked",
      proceed: void 0,
      reset: void 0,
      location: void 0
    };
    ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
    defaultMapRouteProperties = (route) => ({
      hasErrorBoundary: Boolean(route.hasErrorBoundary)
    });
    TRANSITIONS_STORAGE_KEY = "remix-router-transitions";
    UNSAFE_DEFERRED_SYMBOL = Symbol("deferred");
  }
});

// routes-module:routes/_index.tsx?worker
var require_index = __commonJS({
  "routes-module:routes/_index.tsx?worker"(exports, module) {
    module.exports = {};
  }
});

// ../node_modules/@remix-run/server-runtime/dist/mode.js
var require_mode = __commonJS({
  "../node_modules/@remix-run/server-runtime/dist/mode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServerMode2 = /* @__PURE__ */ function(ServerMode3) {
      ServerMode3["Development"] = "development";
      ServerMode3["Production"] = "production";
      ServerMode3["Test"] = "test";
      return ServerMode3;
    }({});
    function isServerMode(value) {
      return value === ServerMode2.Development || value === ServerMode2.Production || value === ServerMode2.Test;
    }
    exports.ServerMode = ServerMode2;
    exports.isServerMode = isServerMode;
  }
});

// ../node_modules/@remix-run/server-runtime/dist/errors.js
var require_errors = __commonJS({
  "../node_modules/@remix-run/server-runtime/dist/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var router = (init_router(), __toCommonJS(router_exports));
    var mode = require_mode();
    function sanitizeError(error, serverMode) {
      if (error instanceof Error && serverMode !== mode.ServerMode.Development) {
        let sanitized = new Error("Unexpected Server Error");
        sanitized.stack = void 0;
        return sanitized;
      }
      return error;
    }
    function sanitizeErrors(errors, serverMode) {
      return Object.entries(errors).reduce((acc, [routeId, error]) => {
        return Object.assign(acc, {
          [routeId]: sanitizeError(error, serverMode)
        });
      }, {});
    }
    function serializeError(error, serverMode) {
      let sanitized = sanitizeError(error, serverMode);
      return {
        message: sanitized.message,
        stack: sanitized.stack
      };
    }
    function serializeErrors(errors, serverMode) {
      if (!errors)
        return null;
      let entries = Object.entries(errors);
      let serialized = {};
      for (let [key, val] of entries) {
        if (router.isRouteErrorResponse(val)) {
          serialized[key] = {
            ...val,
            __type: "RouteErrorResponse"
          };
        } else if (val instanceof Error) {
          let sanitized = sanitizeError(val, serverMode);
          serialized[key] = {
            message: sanitized.message,
            stack: sanitized.stack,
            __type: "Error",
            // If this is a subclass (i.e., ReferenceError), send up the type so we
            // can re-create the same type during hydration.  This will only apply
            // in dev mode since all production errors are sanitized to normal
            // Error instances
            ...sanitized.name !== "Error" ? {
              __subType: sanitized.name
            } : {}
          };
        } else {
          serialized[key] = val;
        }
      }
      return serialized;
    }
    exports.sanitizeError = sanitizeError;
    exports.sanitizeErrors = sanitizeErrors;
    exports.serializeError = serializeError;
    exports.serializeErrors = serializeErrors;
  }
});

// ../node_modules/@remix-run/server-runtime/dist/responses.js
var require_responses = __commonJS({
  "../node_modules/@remix-run/server-runtime/dist/responses.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var router = (init_router(), __toCommonJS(router_exports));
    var errors = require_errors();
    var json5 = (data, init = {}) => {
      return router.json(data, init);
    };
    var defer3 = (data, init = {}) => {
      return router.defer(data, init);
    };
    var redirect4 = (url, init = 302) => {
      return router.redirect(url, init);
    };
    var redirectDocument2 = (url, init = 302) => {
      return router.redirectDocument(url, init);
    };
    function isDeferredData3(value) {
      let deferred = value;
      return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
    }
    function isResponse3(value) {
      return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
    }
    var redirectStatusCodes2 = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
    function isRedirectStatusCode2(statusCode) {
      return redirectStatusCodes2.has(statusCode);
    }
    function isRedirectResponse3(response) {
      return isRedirectStatusCode2(response.status);
    }
    function isTrackedPromise2(value) {
      return value != null && typeof value.then === "function" && value._tracked === true;
    }
    var DEFERRED_VALUE_PLACEHOLDER_PREFIX = "__deferred_promise:";
    function createDeferredReadableStream2(deferredData, signal, serverMode) {
      let encoder = new TextEncoder();
      let stream = new ReadableStream({
        async start(controller) {
          let criticalData = {};
          let preresolvedKeys = [];
          for (let [key, value] of Object.entries(deferredData.data)) {
            if (isTrackedPromise2(value)) {
              criticalData[key] = `${DEFERRED_VALUE_PLACEHOLDER_PREFIX}${key}`;
              if (typeof value._data !== "undefined" || typeof value._error !== "undefined") {
                preresolvedKeys.push(key);
              }
            } else {
              criticalData[key] = value;
            }
          }
          controller.enqueue(encoder.encode(JSON.stringify(criticalData) + "\n\n"));
          for (let preresolvedKey of preresolvedKeys) {
            enqueueTrackedPromise(controller, encoder, preresolvedKey, deferredData.data[preresolvedKey], serverMode);
          }
          let unsubscribe = deferredData.subscribe((aborted, settledKey) => {
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
          [settledKey]: promise._error instanceof Error ? errors.serializeError(promise._error, serverMode) : promise._error
        }) + "\n\n"));
      } else {
        controller.enqueue(encoder.encode("data:" + JSON.stringify({
          [settledKey]: promise._data ?? null
        }) + "\n\n"));
      }
    }
    exports.createDeferredReadableStream = createDeferredReadableStream2;
    exports.defer = defer3;
    exports.isDeferredData = isDeferredData3;
    exports.isRedirectResponse = isRedirectResponse3;
    exports.isRedirectStatusCode = isRedirectStatusCode2;
    exports.isResponse = isResponse3;
    exports.json = json5;
    exports.redirect = redirect4;
    exports.redirectDocument = redirectDocument2;
  }
});

// app/entry.worker.ts
var entry_worker_exports = {};
__export(entry_worker_exports, {
  getLoadContext: () => getLoadContext
});

// ../packages/sw/dist/src/private/logger.js
var methodToColorMap = {
  debug: `#7f8c8d`,
  // Gray
  log: `#2ecc71`,
  // Green
  info: `#3498db`,
  // Blue
  warn: `#f39c12`,
  // Yellow
  error: `#c0392b`,
  // Red
  groupCollapsed: `#3498db`,
  // Blue
  groupEnd: null
  // No colored prefix on groupEnd
};
var logger = false ? (() => {
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  for (const key of loggerMethods) {
    const method = key;
    api[method] = () => {
    };
  }
  return api;
})() : (() => {
  let inGroup = false;
  const print = function(method, args) {
    const self2 = typeof globalThis.self !== "undefined" ? globalThis.self : globalThis;
    if (self2.__DISABLE_PWA_DEV_LOGS) {
      return;
    }
    if (method === "debug" && self2.__DISABLE_PWA_DEBUG_LOGS) {
      return;
    }
    if (method === "info" && self2.__DISABLE_PWA_INFO_LOGS) {
      return;
    }
    if (method === "warn" && self2.__DISABLE_PWA_WARN_LOGS) {
      return;
    }
    if (method === "error" && self2.__DISABLE_PWA_ERROR_LOGS) {
      return;
    }
    if (method === "groupCollapsed") {
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }
    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`
    ];
    const logPrefix = inGroup ? [] : ["%cremix-pwa", styles.join(";")];
    console[method](...logPrefix, ...args);
    if (method === "groupCollapsed") {
      inGroup = true;
    }
    if (method === "groupEnd") {
      inGroup = false;
    }
  };
  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);
  for (const key of loggerMethods) {
    const method = key;
    api[method] = (...args) => {
      print(method, args);
    };
  }
  return api;
})();

// ../packages/sw/dist/src/utils/versioning.js
var clearUpOldCaches = (cacheNames, version) => {
  if (version) {
    cacheNames = cacheNames.map((cacheName) => `${cacheName}-${version}`);
  }
  return caches.keys().then((allCacheNames) => {
    return Promise.all([
      cacheNames.forEach((cacheName) => {
        const { cacheActualName } = getCacheNameAndVersion(cacheName);
        const cachesToDelete = allCacheNames.filter((cache) => cache.startsWith(cacheActualName) && cache !== cacheName);
        console.log(cachesToDelete, allCacheNames);
        cachesToDelete.forEach((oldCacheName) => {
          caches.delete(oldCacheName);
        });
      })
    ]);
  });
};
var getCacheNameAndVersion = (cacheName) => {
  const splittedName = cacheName.split("-");
  const version = splittedName.pop();
  const versionIndex = splittedName.length - 1;
  const cacheActualName = splittedName.slice(0, versionIndex).join("-");
  return { cacheActualName, version };
};

// ../packages/sw/dist/src/message/MessageHandler.js
var MessageHandler = class {
  eventName;
  constructor(eventName) {
    if (!self.__messageHandlers) {
      self.__messageHandlers = /* @__PURE__ */ new Map();
    }
    this.eventName = eventName;
  }
  bind(fn, context) {
    self.__messageHandlers.set(this.eventName, fn.bind(context));
  }
  async handleMessage(event) {
    const { data } = event;
    if (typeof data === "object" && data.type) {
      const handler = self.__messageHandlers.get(data.type);
      if (handler) {
        await handler(event);
      }
    }
  }
};

// ../packages/sw/dist/src/cache/BaseStrategy.js
var CACHE_TIMESTAMP_HEADER = "sw-cache-timestamp";
var BaseStrategy = class {
  cacheName;
  options;
  /**
   * Creates an instance of BaseStrategy.
   * @param {string} cacheName - The name of the cache.
   * @param {Object} options - Configuration options for the strategy.
   */
  constructor(cacheName, options = {}) {
    this.cacheName = cacheName;
    this.options = options;
  }
  /**
   * Opens a cache with the given name.
   * @returns {Promise<Cache>} The cache object.
   */
  async openCache() {
    return await caches.open(this.cacheName);
  }
  ensureRequest(request) {
    if (typeof request === "string") {
      return new Request(request);
    }
    return request;
  }
  /**
   * Optional method to clean up the cache based on the defined options.
   * Can be overridden by subclasses for custom cleanup logic.
   */
  async cleanupCache() {
    const cache = await this.openCache();
    const requests = await cache.keys();
    const now = Date.now();
    const promises = requests.map(async (request) => {
      const response = await cache.match(request);
      const timestamp = response?.headers.get(CACHE_TIMESTAMP_HEADER);
      if (timestamp && now - parseInt(timestamp, 10) > (this.options.maxAgeSeconds ?? 2592e3) * 1e3) {
        await cache.delete(request);
      }
    });
    await Promise.all(promises);
  }
};

// ../packages/sw/dist/src/cache/CacheFirst.js
var CacheFirst = class extends BaseStrategy {
  cacheableResponse;
  constructor(cacheName, options = {}) {
    super(cacheName, options);
    this.cacheableResponse = options.cacheableResponse ?? false;
  }
  /**
   * Handles fetch requests by trying to fetch from the cache first.
   * Falls back to network if the cache doesn't contain a response.
   * @param {Request} req - The request to handle.
   * @returns {Promise<Response>} The cached or network response.
   */
  async handleRequest(req) {
    const request = this.ensureRequest(req);
    const cache = await this.openCache();
    let response = await cache.match(request);
    if (!response) {
      response = await fetch(request);
      if (await this.validateResponse(response)) {
        await this.putInCache(request, response.clone());
        this.validateCache();
      }
    }
    return response;
  }
  /**
   * Puts a response into the cache.
   * @param {Request} request - The request to cache.
   * @param {Response} response - The response to cache.
   */
  async putInCache(request, response) {
    const cache = await this.openCache();
    const timestampedResponse = this.addTimestampHeader(response);
    cache.put(request, timestampedResponse.clone());
  }
  /**
   * Adds a timestamp header to the response.
   * @param {Response} response - The original response.
   * @returns {Response} The new response with the timestamp header.
   */
  addTimestampHeader(response) {
    const headers = new Headers(response.headers);
    headers.append(CACHE_TIMESTAMP_HEADER, Date.now().toString());
    const timestampedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
    return timestampedResponse;
  }
  async validateResponse(response) {
    if (!this.cacheableResponse) {
      return true;
    }
    const { headers = {}, statuses = [] } = this.cacheableResponse;
    const isStatusValid = statuses.length > 0 ? statuses.includes(response.status) : true;
    const isHeaderValid = Object.keys(headers).length > 0 ? Object.entries(headers).every(([key, value]) => response.headers.get(key) === value) : true;
    return isStatusValid && isHeaderValid;
  }
  /**
   * Validates the cache based on custom logic (e.g., max items, TTL).
   * Override this method to implement custom cache validation.
   */
  async validateCache() {
    super.cleanupCache();
  }
};

// ../packages/sw/dist/src/cache/CacheOnly.js
var CacheOnly = class extends BaseStrategy {
  cacheableResponse;
  constructor(cacheName, options = {}) {
    super(cacheName, options);
    this.cacheableResponse = options.cacheableResponse ?? false;
  }
  /**
   * Handles fetch requests by trying to fetch from the cache first.
   * Falls back to network if the cache doesn't contain a response.
   * @param {Request} request - The request to handle.
   * @returns {Promise<Response>} The cached or network response.
   */
  async handleRequest(req) {
    const request = this.ensureRequest(req);
    const cache = await this.openCache();
    const response = await cache.match(request);
    if (!response) {
      throw new Error(`Couldn't locate ${request.url} in the cache!`);
    }
    await this.validateCache();
    return response;
  }
  /**
   * Manually adds a response to the cache.
   * Useful for caching responses from external sources.
   *
   * @param {Request} request - The request to cache.
   * @param {Response} response - The response to cache.
   */
  async addToCache(request, response) {
    const cache = await caches.open(this.cacheName);
    const timedRes = this.addTimestampHeader(response);
    await cache.put(request, timedRes);
  }
  /**
   * Adds a timestamp header to the response.
   * @param {Response} response - The original response.
   * @returns {Response} The new response with the timestamp header.
   */
  addTimestampHeader(response) {
    const headers = new Headers(response.headers);
    headers.append(CACHE_TIMESTAMP_HEADER, Date.now().toString());
    const timestampedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
    return timestampedResponse;
  }
  /**
   * Validates the cache based on custom logic (e.g., max items, TTL).
   * Override this method to implement custom cache validation.
   */
  async validateCache() {
    super.cleanupCache();
  }
};

// ../packages/sw/dist/src/cache/NetworkFirst.js
var NetworkFirst = class extends BaseStrategy {
  networkTimeoutSeconds;
  cacheableResponse;
  constructor(cacheName, options = {}) {
    super(cacheName, options);
    this.networkTimeoutSeconds = options.networkTimeoutInSeconds ?? 10;
    this.cacheableResponse = options.cacheableResponse ?? false;
  }
  /**
   * Handles fetch requests by trying to fetch from the network first.
   * Falls back to cache if the network fails or times out.
   * @param {Request} request - The request to handle.
   * @returns {Promise<Response>} The network or cached response.
   */
  async handleRequest(req) {
    const request = this.ensureRequest(req);
    try {
      const res = await this.fetchWithTimeout(request);
      if (await this.validateResponse(res))
        await this.putInCache(request, res);
      return res;
    } catch (error) {
      const cache = await this.openCache();
      const response = await cache.match(request);
      if (response)
        return response;
      throw new Error("No response received from fetch: Timeout");
    }
  }
  /**
   * Puts a response into the cache.
   * @param {Request} request - The request to cache.
   * @param {Response} response - The response to cache.
   */
  async putInCache(request, response) {
    const cache = await this.openCache();
    const timestampedResponse = this.addTimestampHeader(response);
    cache.put(request, timestampedResponse.clone());
    this.cleanupCache();
  }
  /**
   * Adds a timestamp header to the response.
   * @param {Response} response - The original response.
   * @returns {Response} The new response with the timestamp header.
   */
  addTimestampHeader(response) {
    const headers = new Headers(response.headers);
    headers.append(CACHE_TIMESTAMP_HEADER, Date.now().toString());
    const timestampedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
    return timestampedResponse;
  }
  async validateResponse(response) {
    if (!this.cacheableResponse) {
      return true;
    }
    const { headers = {}, statuses = [] } = this.cacheableResponse;
    const isStatusValid = statuses.length > 0 ? statuses.includes(response.status) : true;
    const isHeaderValid = Object.keys(headers).length > 0 ? Object.entries(headers).every(([key, value]) => response.headers.get(key) === value) : true;
    return isStatusValid && isHeaderValid;
  }
  /**
   * Fetches a request with a timeout.
   * @param {Request} request - The request to fetch.
   * @returns {Promise<Response>} The fetched response.
   */
  async fetchWithTimeout(request) {
    const timeoutSeconds = this.networkTimeoutSeconds;
    const timeoutPromise = timeoutSeconds !== Infinity ? new Promise((_resolve, reject) => setTimeout(() => reject(new Error(`Network timed out after ${timeoutSeconds} seconds`)), timeoutSeconds * 1e3)) : null;
    if (timeoutPromise) {
      return Promise.race([fetch(request), timeoutPromise]);
    } else {
      return fetch(request);
    }
  }
};

// ../packages/sw/dist/src/cache/StaleWhileRevalidate.js
var StaleWhileRevalidate = class extends BaseStrategy {
  // private ttl: number;
  // private notifyUpdates: boolean;
  // TODO(ShafSpecs): Add cacheableResponse capabilities to SWR!
  constructor(cacheName, options = {}) {
    super(cacheName, options);
  }
  /**
   * Handles fetch requests by serving stale content from cache and revalidating from the network.
   * @param {Request} request - The request to handle.
   * @returns {Promise<Response>} The response from the cache or network.
   */
  async handleRequest(req) {
    const request = this.ensureRequest(req);
    const cache = await this.openCache();
    const cachedResponse = await cache.match(request);
    const networkFetch = fetch(request).then((response) => this.updateCache(request, response));
    return cachedResponse || networkFetch;
  }
  /**
   * Updates the cache with a new response from the network.
   * @param {Request} request - The request associated with the response.
   * @param {Response} response - The response to cache.
   */
  async updateCache(request, response) {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }
    const cache = await this.openCache();
    const timedResponse = this.addTimestampHeader(response);
    cache.put(request, timedResponse.clone());
    await this.cleanupCache();
    return timedResponse;
  }
  /**
   * Adds a timestamp header to the response.
   * @param {Response} response - The original response.
   * @returns {Response} The new response with the timestamp header.
   */
  addTimestampHeader(response) {
    const headers = new Headers(response.headers);
    headers.append(CACHE_TIMESTAMP_HEADER, Date.now().toString());
    const timestampedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
    return timestampedResponse;
  }
};

// ../packages/sw/dist/src/cache/EnhancedCache.js
var EnhancedCache = class {
  cacheName;
  strategy;
  constructor(cacheName, options = {}) {
    this.cacheName = `${cacheName}-${options.version || "v1"}`;
    this.strategy = this.selectStrategy(options.strategy, options.strategyOptions);
  }
  selectStrategy(strategyName, options) {
    switch (strategyName) {
      case "CacheFirst":
        return new CacheFirst(this.cacheName, options);
      case "CacheOnly":
        return new CacheOnly(this.cacheName, options);
      case "NetworkFirst":
        return new NetworkFirst(this.cacheName, options);
      case "StaleWhileRevalidate":
        return new StaleWhileRevalidate(this.cacheName, options);
      default:
        return new NetworkFirst(this.cacheName, options);
    }
  }
  async handleRequest(request) {
    return await this.strategy.handleRequest(request);
  }
  /**
   * Adds a timestamp header to the response.
   * @param {Response} response - The original response.
   * @returns {Response} The new response with the timestamp header.
   */
  addTimestampHeader(response) {
    const headers = new Headers(response.headers);
    headers.append(CACHE_TIMESTAMP_HEADER, Date.now().toString());
    const timestampedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
    return timestampedResponse;
  }
  /**
   * Manually adds a response to the cache.
   * Useful for caching responses from external sources.
   *
   * @param {Request} request - The request to cache.
   * @param {Response} response - The response to cache.
   */
  async addToCache(request, response) {
    if (typeof request === "string")
      request = new Request(request);
    const cache = await caches.open(this.cacheName);
    const timestampedResponse = this.addTimestampHeader(response);
    cache.put(request, timestampedResponse.clone());
  }
  /**
   * Manually removes a response from the cache.
   * Useful for removing responses from external sources.
   *
   * @param {Request | string | URL} request - The request to remove from the cache.
   * @returns {Promise<void>}
   */
  async removeFromCache(request) {
    if (typeof request === "string")
      request = new URL(request);
    const cache = await caches.open(this.cacheName);
    await cache.delete(request);
  }
  async match(request) {
    if (typeof request === "string")
      request = new Request(request);
    const cache = await caches.open(this.cacheName);
    return await cache.match(request);
  }
  /**
   * Clears the entire cache.
   */
  async clearCache() {
    const cache = await caches.open(this.cacheName);
    const requests = await cache.keys();
    return Promise.all(requests.map((request) => cache.delete(request)));
  }
  /**
   * Retrieves all cached requests and their corresponding responses.
   * Useful for debugging or cache inspection.
   *
   * @returns {Promise<Array<{request: Request, response: Response | undefined}>>}
   */
  async getCacheEntries() {
    const cache = await caches.open(this.cacheName);
    const requests = await cache.keys();
    const entries = await Promise.all(requests.map(async (request) => ({
      request,
      response: await cache.match(request)
    })));
    return entries;
  }
  /**
   * Provides cache statistics like number of items and total size.
   * Useful for debugging or cache inspection.
   * @returns {Promise<CacheStats>}
   */
  async getCacheStats() {
    const entries = await this.getCacheEntries();
    const stats = {
      itemCount: entries.length,
      totalSize: 0
    };
    for (const entry2 of entries) {
      const response = entry2.response;
      if (response) {
        const clonedResponse = response.clone();
        const blob = await clonedResponse.blob();
        stats.totalSize += blob.size;
      }
    }
    return stats;
  }
  /**
   * Updates cached assets with a newer version if available.
   * Requires server to indicate asset version in response headers.
   *
   * @param {string[]} urlList - List of URLs to check for newer versions.
   * @param {string} header - Header name to check for asset version.
   * @returns {Promise<void>}
   */
  // Middlewares should expand this beyond just actions/loaders
  async updateAssetsIfNewer(urlList, header = "X-Asset-Version") {
    const cache = await caches.open(this.cacheName);
    urlList.forEach(async (url) => {
      const cachedResponse = await cache.match(url);
      if (!cachedResponse)
        return;
      const cachedVersion = cachedResponse.headers.get(header) ?? "undefined";
      const response = await fetch(url);
      const newVersion = response.headers.get(header) ?? "undefined";
      if (newVersion !== cachedVersion && response.ok) {
        await cache.put(url, response);
      }
    });
  }
  /**
   * Caches assets from a list of URLs.
   * Useful for pre-caching critical assets or assets that are not part of the service worker scope.
   *
   * @param {string[]} urlList - List of URLs to cache.
   * @returns {Promise<void>}
   */
  async preCacheUrls(urlList) {
    const cache = await caches.open(this.cacheName);
    urlList.forEach((url) => {
      fetch(url).then((response) => {
        if (response.ok)
          cache.put(url, response);
      });
    });
  }
};

// ../packages/sw/dist/src/message/NavigationHandler.js
var NavigationHandler = class extends MessageHandler {
  _allowList;
  _denyList;
  _documentCache;
  constructor(options) {
    super("REMIX_NAVIGATION");
    this._allowList = options.allowList || [];
    this._denyList = options.denyList || [];
    if (typeof options.documentCache === "string") {
      this._documentCache = new EnhancedCache(options.documentCache);
    } else {
      this._documentCache = options.documentCache;
    }
    this.bind(this._handleMessage, this);
  }
  async _handleMessage(event) {
    const { data } = event;
    if (data.type === "REMIX_NAVIGATION") {
      const { location: location2 } = data.payload;
      const documentUrl = location2.pathname + location2.search + location2.hash;
      if (this._allowList.length > 0 && !this._allowList.some((pattern) => documentUrl.match(pattern))) {
        return;
      }
      if (this._denyList.length > 0 && this._denyList.some((pattern) => documentUrl.match(pattern))) {
        return;
      }
      await this._documentCache.handleRequest(documentUrl);
    }
  }
};

// ../packages/sync/dist/src/request.js
var serializableProperties = [
  "method",
  "referrer",
  "referrerPolicy",
  "mode",
  "credentials",
  "cache",
  "redirect",
  "integrity",
  "keepalive"
];
var StorableRequest = class _StorableRequest {
  _requestData;
  /**
   * Converts a Request object to a plain object that can be structured
   * cloned or JSON-stringified.
   *
   * @param {Request} request
   * @return {Promise<StorableRequest>}
   */
  static async fromRequest(request) {
    const requestData = {
      url: request.url,
      headers: {}
    };
    if (request.method !== "GET") {
      requestData.body = await request.clone().arrayBuffer();
    }
    for (const [key, value] of request.headers.entries()) {
      requestData.headers[key] = value;
    }
    for (const prop of serializableProperties) {
      if (request[prop] !== void 0) {
        requestData[prop] = request[prop];
      }
    }
    return new _StorableRequest(requestData);
  }
  /**
   * Accepts an object of request data that can be used to construct a
   * `Request` but can also be stored in IndexedDB.
   *
   * @param {Object} requestData An object of request data that includes the
   *     `url` plus any relevant properties of
   *     [requestInit]{@link https://fetch.spec.whatwg.org/#requestinit}.
   */
  constructor(requestData) {
    if (requestData.mode === "navigate") {
      requestData.mode = "same-origin";
    }
    this._requestData = requestData;
  }
  /**
   * Returns a deep clone of the instances `_requestData` object.
   *
   * @return {Object}
   */
  toObject() {
    const requestData = Object.assign({}, this._requestData);
    requestData.headers = Object.assign({}, this._requestData.headers);
    if (requestData.body) {
      requestData.body = requestData.body.slice(0);
    }
    return requestData;
  }
  /**
   * Converts this instance to a Request.
   *
   * @return {Request}
   */
  toRequest() {
    return new Request(this._requestData.url, this._requestData);
  }
  /**
   * Creates and returns a deep clone of the instance.
   *
   * @return {StorableRequest}
   */
  clone() {
    return new _StorableRequest(this.toObject());
  }
};

// ../node_modules/idb/build/wrap-idb-value.js
var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
var idbProxyableTypes;
var cursorAdvanceMethods;
function getIdbProxyableTypes() {
  return idbProxyableTypes || (idbProxyableTypes = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function getCursorAdvanceMethods() {
  return cursorAdvanceMethods || (cursorAdvanceMethods = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
var cursorRequestMap = /* @__PURE__ */ new WeakMap();
var transactionDoneMap = /* @__PURE__ */ new WeakMap();
var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
var transformCache = /* @__PURE__ */ new WeakMap();
var reverseTransformCache = /* @__PURE__ */ new WeakMap();
function promisifyRequest(request) {
  const promise = new Promise((resolve, reject) => {
    const unlisten = () => {
      request.removeEventListener("success", success);
      request.removeEventListener("error", error);
    };
    const success = () => {
      resolve(wrap(request.result));
      unlisten();
    };
    const error = () => {
      reject(request.error);
      unlisten();
    };
    request.addEventListener("success", success);
    request.addEventListener("error", error);
  });
  promise.then((value) => {
    if (value instanceof IDBCursor) {
      cursorRequestMap.set(value, request);
    }
  }).catch(() => {
  });
  reverseTransformCache.set(promise, request);
  return promise;
}
function cacheDonePromiseForTransaction(tx) {
  if (transactionDoneMap.has(tx))
    return;
  const done = new Promise((resolve, reject) => {
    const unlisten = () => {
      tx.removeEventListener("complete", complete);
      tx.removeEventListener("error", error);
      tx.removeEventListener("abort", error);
    };
    const complete = () => {
      resolve();
      unlisten();
    };
    const error = () => {
      reject(tx.error || new DOMException("AbortError", "AbortError"));
      unlisten();
    };
    tx.addEventListener("complete", complete);
    tx.addEventListener("error", error);
    tx.addEventListener("abort", error);
  });
  transactionDoneMap.set(tx, done);
}
var idbProxyTraps = {
  get(target, prop, receiver) {
    if (target instanceof IDBTransaction) {
      if (prop === "done")
        return transactionDoneMap.get(target);
      if (prop === "objectStoreNames") {
        return target.objectStoreNames || transactionStoreNamesMap.get(target);
      }
      if (prop === "store") {
        return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
      }
    }
    return wrap(target[prop]);
  },
  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
  has(target, prop) {
    if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
      return true;
    }
    return prop in target;
  }
};
function replaceTraps(callback) {
  idbProxyTraps = callback(idbProxyTraps);
}
function wrapFunction(func) {
  if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
    return function(storeNames, ...args) {
      const tx = func.call(unwrap(this), storeNames, ...args);
      transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
      return wrap(tx);
    };
  }
  if (getCursorAdvanceMethods().includes(func)) {
    return function(...args) {
      func.apply(unwrap(this), args);
      return wrap(cursorRequestMap.get(this));
    };
  }
  return function(...args) {
    return wrap(func.apply(unwrap(this), args));
  };
}
function transformCachableValue(value) {
  if (typeof value === "function")
    return wrapFunction(value);
  if (value instanceof IDBTransaction)
    cacheDonePromiseForTransaction(value);
  if (instanceOfAny(value, getIdbProxyableTypes()))
    return new Proxy(value, idbProxyTraps);
  return value;
}
function wrap(value) {
  if (value instanceof IDBRequest)
    return promisifyRequest(value);
  if (transformCache.has(value))
    return transformCache.get(value);
  const newValue = transformCachableValue(value);
  if (newValue !== value) {
    transformCache.set(value, newValue);
    reverseTransformCache.set(newValue, value);
  }
  return newValue;
}
var unwrap = (value) => reverseTransformCache.get(value);

// ../node_modules/idb/build/index.js
function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
  const request = indexedDB.open(name, version);
  const openPromise = wrap(request);
  if (upgrade) {
    request.addEventListener("upgradeneeded", (event) => {
      upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
    });
  }
  if (blocked) {
    request.addEventListener("blocked", (event) => blocked(
      // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
      event.oldVersion,
      event.newVersion,
      event
    ));
  }
  openPromise.then((db) => {
    if (terminated)
      db.addEventListener("close", () => terminated());
    if (blocking) {
      db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
    }
  }).catch(() => {
  });
  return openPromise;
}
var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
var writeMethods = ["put", "add", "delete", "clear"];
var cachedMethods = /* @__PURE__ */ new Map();
function getMethod(target, prop) {
  if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
    return;
  }
  if (cachedMethods.get(prop))
    return cachedMethods.get(prop);
  const targetFuncName = prop.replace(/FromIndex$/, "");
  const useIndex = prop !== targetFuncName;
  const isWrite = writeMethods.includes(targetFuncName);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
  ) {
    return;
  }
  const method = async function(storeName, ...args) {
    const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
    let target2 = tx.store;
    if (useIndex)
      target2 = target2.index(args.shift());
    return (await Promise.all([
      target2[targetFuncName](...args),
      isWrite && tx.done
    ]))[0];
  };
  cachedMethods.set(prop, method);
  return method;
}
replaceTraps((oldTraps) => ({
  ...oldTraps,
  get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
  has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
}));

// ../packages/sync/dist/src/db.js
var DB_VERSION = 3;
var DB_NAME = "remix-pwa-sync";
var REQUEST_OBJECT_STORE_NAME = "failed-requests";
var QUEUE_NAME_INDEX = "queueName";
var QueueDb = class {
  _db = null;
  /**
   * Add QueueStoreEntry to underlying db.
   *
   * @param {UnidentifiedQueueStoreEntry} entry
   */
  async addEntry(entry2) {
    const db = await this.getDb();
    const tx = db.transaction(REQUEST_OBJECT_STORE_NAME, "readwrite", {
      durability: "relaxed"
    });
    await tx.store.add(entry2);
    await tx.done;
  }
  /**
   * Returns the first entry id in the ObjectStore.
   *
   * @return {number | undefined}
   */
  async getFirstEntryId() {
    const db = await this.getDb();
    const cursor = await db.transaction(REQUEST_OBJECT_STORE_NAME).store.openCursor();
    return cursor?.value.id;
  }
  /**
   * Get all the entries filtered by index
   *
   * @param queueName
   * @return {Promise<QueueStoreEntry[]>}
   */
  async getAllEntriesByQueueName(queueName) {
    const db = await this.getDb();
    const results = await db.getAllFromIndex(REQUEST_OBJECT_STORE_NAME, QUEUE_NAME_INDEX, IDBKeyRange.only(queueName));
    return results || new Array();
  }
  /**
   * Returns the number of entries filtered by index
   *
   * @param queueName
   * @return {Promise<number>}
   */
  async getEntryCountByQueueName(queueName) {
    const db = await this.getDb();
    return db.countFromIndex(REQUEST_OBJECT_STORE_NAME, QUEUE_NAME_INDEX, IDBKeyRange.only(queueName));
  }
  /**
   * Deletes a single entry by id.
   *
   * @param {number} id the id of the entry to be deleted
   */
  async deleteEntry(id) {
    const db = await this.getDb();
    await db.delete(REQUEST_OBJECT_STORE_NAME, id);
  }
  /**
   *
   * @param queueName
   * @returns {Promise<QueueStoreEntry | undefined>}
   */
  async getFirstEntryByQueueName(queueName) {
    return await this.getEndEntryFromIndex(IDBKeyRange.only(queueName), "next");
  }
  /**
   *
   * @param queueName
   * @returns {Promise<QueueStoreEntry | undefined>}
   */
  async getLastEntryByQueueName(queueName) {
    return await this.getEndEntryFromIndex(IDBKeyRange.only(queueName), "prev");
  }
  /**
   * Returns either the first or the last entries, depending on direction.
   * Filtered by index.
   *
   * @param {IDBCursorDirection} direction
   * @param {IDBKeyRange} query
   * @return {Promise<QueueStoreEntry | undefined>}
   * @private
   */
  async getEndEntryFromIndex(query, direction) {
    const db = await this.getDb();
    const cursor = await db.transaction(REQUEST_OBJECT_STORE_NAME).store.index(QUEUE_NAME_INDEX).openCursor(query, direction);
    return cursor?.value;
  }
  /**
   * Returns an open connection to the database.
   *
   * @private
   */
  async getDb() {
    if (!this._db) {
      this._db = await openDB(DB_NAME, DB_VERSION, {
        upgrade: this._upgradeDb
      });
    }
    return this._db;
  }
  /**
   * Upgrades QueueDB
   *
   * @param {IDBPDatabase<QueueDBSchema>} db
   * @param {number} oldVersion
   * @private
   */
  _upgradeDb(db, oldVersion) {
    if (oldVersion > 0 && oldVersion < DB_VERSION) {
      if (db.objectStoreNames.contains(REQUEST_OBJECT_STORE_NAME)) {
        db.deleteObjectStore(REQUEST_OBJECT_STORE_NAME);
      }
    }
    const objStore = db.createObjectStore(REQUEST_OBJECT_STORE_NAME, {
      autoIncrement: true,
      keyPath: "id"
    });
    objStore.createIndex(QUEUE_NAME_INDEX, QUEUE_NAME_INDEX, { unique: false });
  }
};

// ../packages/sync/dist/src/store.js
var QueueStore = class {
  _queueName;
  _queueDb;
  /**
   * Associates this instance with a Queue instance, so entries added can be
   * identified by their queue name.
   *
   * @param {string} queueName
   */
  constructor(queueName) {
    this._queueName = queueName;
    this._queueDb = new QueueDb();
  }
  /**
   * Append an entry last in the queue.
   *
   * @param {Object} entry
   * @param {Object} entry.requestData
   * @param {number} [entry.timestamp]
   * @param {Object} [entry.metadata]
   */
  async pushEntry(entry2) {
    delete entry2.id;
    entry2.queueName = this._queueName;
    await this._queueDb.addEntry(entry2);
  }
  /**
   * Prepend an entry first in the queue.
   *
   * @param {Object} entry
   * @param {Object} entry.requestData
   * @param {number} [entry.timestamp]
   * @param {Object} [entry.metadata]
   */
  async unshiftEntry(entry2) {
    const firstId = await this._queueDb.getFirstEntryId();
    if (firstId) {
      entry2.id = firstId - 1;
    } else {
      delete entry2.id;
    }
    entry2.queueName = this._queueName;
    await this._queueDb.addEntry(entry2);
  }
  /**
   * Removes and returns the last entry in the queue matching the `queueName`.
   *
   * @return {Promise<QueueStoreEntry|undefined>}
   */
  async popEntry() {
    return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName));
  }
  /**
   * Removes and returns the first entry in the queue matching the `queueName`.
   *
   * @return {Promise<QueueStoreEntry|undefined>}
   */
  async shiftEntry() {
    return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName));
  }
  /**
   * Returns all entries in the store matching the `queueName`.
   *
   * @param {Object} options See {@link workbox-background-sync.Queue~getAll}
   * @return {Promise<Array<Object>>}
   */
  async getAll() {
    return await this._queueDb.getAllEntriesByQueueName(this._queueName);
  }
  /**
   * Returns the number of entries in the store matching the `queueName`.
   *
   * @param {Object} options See {@link workbox-background-sync.Queue~size}
   * @return {Promise<number>}
   */
  async size() {
    return await this._queueDb.getEntryCountByQueueName(this._queueName);
  }
  /**
   * Deletes the entry for the given ID.
   *
   * WARNING: this method does not ensure the deleted entry belongs to this
   * queue (i.e. matches the `queueName`). But this limitation is acceptable
   * as this class is not publicly exposed. An additional check would make
   * this method slower than it needs to be.
   *
   * @param {number} id
   */
  async deleteEntry(id) {
    await this._queueDb.deleteEntry(id);
  }
  /**
   * Removes and returns the first or last entry in the queue (based on the
   * `direction` argument) matching the `queueName`.
   *
   * @return {Promise<QueueStoreEntry|undefined>}
   * @private
   */
  async _removeEntry(entry2) {
    if (entry2) {
      await this.deleteEntry(entry2.id);
    }
    return entry2;
  }
};

// ../packages/sync/dist/src/queue.js
var TAG_PREFIX = "rp-sync";
var MAX_RETENTION_TIME = 60 * 24 * 7;
var queueNames = /* @__PURE__ */ new Set();
var convertEntry = (queueStoreEntry) => {
  const queueEntry = {
    request: new StorableRequest(queueStoreEntry.requestData).toRequest(),
    timestamp: queueStoreEntry.timestamp
  };
  if (queueStoreEntry.metadata) {
    queueEntry.metadata = queueStoreEntry.metadata;
  }
  return queueEntry;
};
var Queue = class {
  _name;
  _onSync;
  _maxRetentionTime;
  _queueStore;
  _syncInProgress = false;
  _requestsAddedDuringSync = false;
  /**
   * Creates an instance of Queue with the given options
   *
   * @param {string} name The unique name for this queue. This name must be
   *     unique as it's used to register sync events and store requests
   *     in IndexedDB specific to this instance. An error will be thrown if
   *     a duplicate name is detected.
   * @param {Object} [options]
   * @param {Function} [options.onSync] A function that gets invoked whenever
   *     the 'sync' event fires. The function is invoked with an object
   *     containing the `queue` property (referencing this instance), and you
   *     can use the callback to customize the replay behavior of the queue.
   *     When not set the `replayRequests()` method is called.
   *     Note: if the replay fails after a sync event, make sure you throw an
   *     error, so the browser knows to retry the sync event later.
   * @param {number} [options.maxRetentionTime=7 days] The amount of time (in
   *     minutes) a request may be retried. After this amount of time has
   *     passed, the request will be deleted from the queue.
   */
  constructor(name, { maxRetentionTime, onSync } = {}) {
    this._name = name;
    this._onSync = onSync || this.replayRequests;
    this._maxRetentionTime = maxRetentionTime || MAX_RETENTION_TIME;
    this._queueStore = new QueueStore(this._name);
    this._addSyncListener();
  }
  /**
   * @return {string}
   */
  get name() {
    return this._name;
  }
  /**
   * Stores the passed request in IndexedDB (with its timestamp and any
   * metadata) at the end of the queue.
   *
   * @param {QueueEntry} entry
   * @param {Request} entry.request The request to store in the queue.
   * @param {Object} [entry.metadata] Any metadata you want associated with the
   *     stored request. When requests are replayed you'll have access to this
   *     metadata object in case you need to modify the request beforehand.
   * @param {number} [entry.timestamp] The timestamp (Epoch time in
   *     milliseconds) when the request was first added to the queue. This is
   *     used along with `maxRetentionTime` to remove outdated requests. In
   *     general you don't need to set this value, as it's automatically set
   *     for you (defaulting to `Date.now()`), but you can update it if you
   *     don't want particular requests to expire.
   */
  async pushRequest(entry2) {
    await this._addRequest(entry2, "push");
  }
  /**
   * Stores the passed request in IndexedDB (with its timestamp and any
   * metadata) at the beginning of the queue.
   *
   * @param {QueueEntry} entry
   * @param {Request} entry.request The request to store in the queue.
   * @param {Object} [entry.metadata] Any metadata you want associated with the
   *     stored request. When requests are replayed you'll have access to this
   *     metadata object in case you need to modify the request beforehand.
   * @param {number} [entry.timestamp] The timestamp (Epoch time in
   *     milliseconds) when the request was first added to the queue. This is
   *     used along with `maxRetentionTime` to remove outdated requests. In
   *     general you don't need to set this value, as it's automatically set
   *     for you (defaulting to `Date.now()`), but you can update it if you
   *     don't want particular requests to expire.
   */
  async unshiftRequest(entry2) {
    await this._addRequest(entry2, "unshift");
  }
  /**
   * Removes and returns the last request in the queue (along with its
   * timestamp and any metadata). The returned object takes the form:
   * `{request, timestamp, metadata}`.
   *
   * @return {Promise<QueueEntry | undefined>}
   */
  async popRequest() {
    return this._removeRequest("pop");
  }
  /**
   * Removes and returns the first request in the queue (along with its
   * timestamp and any metadata). The returned object takes the form:
   * `{request, timestamp, metadata}`.
   *
   * @return {Promise<QueueEntry | undefined>}
   */
  async shiftRequest() {
    return this._removeRequest("shift");
  }
  /**
   * Returns all the entries that have not expired (per `maxRetentionTime`).
   * Any expired entries are removed from the queue.
   *
   * @return {Promise<Array<QueueEntry>>}
   */
  async getAll() {
    const allEntries = await this._queueStore.getAll();
    const now = Date.now();
    const unexpiredEntries = [];
    for (const entry2 of allEntries) {
      const maxRetentionTimeInMs = this._maxRetentionTime * 60 * 1e3;
      if (now - entry2.timestamp > maxRetentionTimeInMs) {
        await this._queueStore.deleteEntry(entry2.id);
      } else {
        unexpiredEntries.push(convertEntry(entry2));
      }
    }
    return unexpiredEntries;
  }
  /**
   * Returns the number of entries present in the queue.
   * Note that expired entries (per `maxRetentionTime`) are also included in this count.
   *
   * @return {Promise<number>}
   */
  async size() {
    return await this._queueStore.size();
  }
  /**
   * Adds the entry to the QueueStore and registers for a sync event.
   *
   * @param {Object} entry
   * @param {Request} entry.request
   * @param {Object} [entry.metadata]
   * @param {number} [entry.timestamp=Date.now()]
   * @param {string} operation ('push' or 'unshift')
   * @private
   */
  async _addRequest({ metadata, request, timestamp = Date.now() }, operation) {
    const storableRequest = await StorableRequest.fromRequest(request.clone());
    const entry2 = {
      requestData: storableRequest.toObject(),
      timestamp
    };
    if (metadata) {
      entry2.metadata = metadata;
    }
    switch (operation) {
      case "push":
        await this._queueStore.pushEntry(entry2);
        break;
      case "unshift":
        await this._queueStore.unshiftEntry(entry2);
        break;
    }
    if (true) {
    }
    if (this._syncInProgress) {
      this._requestsAddedDuringSync = true;
    } else {
      await this.registerSync();
    }
  }
  /**
   * Removes and returns the first or last (depending on `operation`) entry
   * from the QueueStore that's not older than the `maxRetentionTime`.
   *
   * @param {string} operation ('pop' or 'shift')
   * @return {Object|undefined}
   * @private
   */
  async _removeRequest(operation) {
    const now = Date.now();
    let entry2;
    switch (operation) {
      case "pop":
        entry2 = await this._queueStore.popEntry();
        break;
      case "shift":
        entry2 = await this._queueStore.shiftEntry();
        break;
    }
    if (entry2) {
      const maxRetentionTimeInMs = this._maxRetentionTime * 60 * 1e3;
      if (now - entry2.timestamp > maxRetentionTimeInMs) {
        return this._removeRequest(operation);
      }
      return convertEntry(entry2);
    } else {
      return void 0;
    }
  }
  /**
   * Loops through each request in the queue and attempts to re-fetch it.
   * If any request fails to re-fetch, it's put back in the same position in
   * the queue (which registers a retry for the next sync event).
   */
  async replayRequests() {
    let entry2;
    while (entry2 = await this.shiftRequest()) {
      try {
        await fetch(entry2.request.clone());
        if (true) {
        }
      } catch (error) {
        await this.unshiftRequest(entry2);
        if (true) {
        }
      }
    }
    if (true) {
    }
  }
  /**
   * Registers a sync event with a tag unique to this instance.
   */
  async registerSync() {
    if ("sync" in self.registration) {
      try {
        await self.registration.sync.register(`${TAG_PREFIX}:${this._name}`);
      } catch (err) {
      }
    }
  }
  /**
   * In sync-supporting browsers, this adds a listener for the sync event.
   * In non-sync-supporting browsers, or if _forceSyncFallback is true, this
   * will retry the queue on service worker startup.
   *
   * @private
   */
  _addSyncListener() {
    if ("sync" in self.registration) {
      self.addEventListener("sync", (event) => {
        if (event.tag === `${TAG_PREFIX}:${this._name}`) {
          const syncComplete = async () => {
            this._syncInProgress = true;
            let syncError;
            try {
              await this._onSync({ queue: this });
            } catch (error) {
              if (error instanceof Error) {
                syncError = error;
                throw syncError;
              }
            } finally {
              if (this._requestsAddedDuringSync && !(syncError && !event.lastChance)) {
                await this.registerSync();
              }
              this._syncInProgress = false;
              this._requestsAddedDuringSync = false;
            }
          };
          event.waitUntil(syncComplete());
        }
      });
    } else {
      void this._onSync({ queue: this });
    }
  }
  /**
   * Returns the set of queue names. This is primarily used to reset the list
   * of queue names in tests.
   *
   * @return {Set<string>}
   *
   * @private
   */
  static get _queueNames() {
    return queueNames;
  }
};

// ../packages/sync/dist/src/export.js
var SyncQueue = class {
  static queues = /* @__PURE__ */ new Map();
  static createQueue(name) {
    if (this.queues.has(name)) {
      throw new Error(`Queue "${name}" already exists`);
    }
    const _q = new Queue(name);
    this.queues.set(name, _q);
    return _q;
  }
  static getQueue(name) {
    return this.queues.get(name);
  }
  static removeQueue(name) {
    this.queues.delete(name);
  }
  static async getQueueNames() {
    return Array.from(this.queues.keys());
  }
  static async getQueueSizes() {
    const sizes = /* @__PURE__ */ new Map();
    for (const [name, queue] of this.queues) {
      sizes.set(name, await queue.size());
    }
    return sizes;
  }
  /* WIP */
  async getQueueByTag(tag) {
    for (const [name, queue] of /* @__PURE__ */ new Map()) {
      if (name === tag) {
        return queue;
      }
    }
    return void 0;
  }
};
var queueToServer = ({ name, request }) => {
  let queue;
  try {
    queue = SyncQueue.createQueue(name);
  } catch (e) {
    queue = SyncQueue.getQueue(name);
  }
  queue.pushRequest({ request });
};
var registerQueue = (name) => {
  SyncQueue.createQueue(name);
};

// ../node_modules/dexie/dist/modern/dexie.mjs
var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
var keys = Object.keys;
var isArray = Array.isArray;
if (typeof Promise !== "undefined" && !_global.Promise) {
  _global.Promise = Promise;
}
function extend(obj, extension) {
  if (typeof extension !== "object")
    return obj;
  keys(extension).forEach(function(key) {
    obj[key] = extension[key];
  });
  return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
  return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
  if (typeof extension === "function")
    extension = extension(getProto(proto));
  (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach((key) => {
    setProp(proto, key, extension[key]);
  });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
  defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } : { value: functionOrGetSet, configurable: true, writable: true }, options));
}
function derive(Child) {
  return {
    from: function(Parent) {
      Child.prototype = Object.create(Parent.prototype);
      setProp(Child.prototype, "constructor", Child);
      return {
        extend: props.bind(null, Child.prototype)
      };
    }
  };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
  const pd = getOwnPropertyDescriptor(obj, prop);
  let proto;
  return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
  return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
  return overridedFactory(origFunc);
}
function assert(b2) {
  if (!b2)
    throw new Error("Assertion Failed");
}
function asap$1(fn) {
  if (_global.setImmediate)
    setImmediate(fn);
  else
    setTimeout(fn, 0);
}
function arrayToObject(array, extractor) {
  return array.reduce((result, item, i) => {
    var nameAndValue = extractor(item, i);
    if (nameAndValue)
      result[nameAndValue[0]] = nameAndValue[1];
    return result;
  }, {});
}
function tryCatch(fn, onerror, args) {
  try {
    fn.apply(null, args);
  } catch (ex) {
    onerror && onerror(ex);
  }
}
function getByKeyPath(obj, keyPath) {
  if (hasOwn(obj, keyPath))
    return obj[keyPath];
  if (!keyPath)
    return obj;
  if (typeof keyPath !== "string") {
    var rv = [];
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      var val = getByKeyPath(obj, keyPath[i]);
      rv.push(val);
    }
    return rv;
  }
  var period = keyPath.indexOf(".");
  if (period !== -1) {
    var innerObj = obj[keyPath.substr(0, period)];
    return innerObj === void 0 ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
  }
  return void 0;
}
function setByKeyPath(obj, keyPath, value) {
  if (!obj || keyPath === void 0)
    return;
  if ("isFrozen" in Object && Object.isFrozen(obj))
    return;
  if (typeof keyPath !== "string" && "length" in keyPath) {
    assert(typeof value !== "string" && "length" in value);
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      setByKeyPath(obj, keyPath[i], value[i]);
    }
  } else {
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var currentKeyPath = keyPath.substr(0, period);
      var remainingKeyPath = keyPath.substr(period + 1);
      if (remainingKeyPath === "")
        if (value === void 0) {
          if (isArray(obj) && !isNaN(parseInt(currentKeyPath)))
            obj.splice(currentKeyPath, 1);
          else
            delete obj[currentKeyPath];
        } else
          obj[currentKeyPath] = value;
      else {
        var innerObj = obj[currentKeyPath];
        if (!innerObj || !hasOwn(obj, currentKeyPath))
          innerObj = obj[currentKeyPath] = {};
        setByKeyPath(innerObj, remainingKeyPath, value);
      }
    } else {
      if (value === void 0) {
        if (isArray(obj) && !isNaN(parseInt(keyPath)))
          obj.splice(keyPath, 1);
        else
          delete obj[keyPath];
      } else
        obj[keyPath] = value;
    }
  }
}
function delByKeyPath(obj, keyPath) {
  if (typeof keyPath === "string")
    setByKeyPath(obj, keyPath, void 0);
  else if ("length" in keyPath)
    [].map.call(keyPath, function(kp) {
      setByKeyPath(obj, kp, void 0);
    });
}
function shallowClone(obj) {
  var rv = {};
  for (var m in obj) {
    if (hasOwn(obj, m))
      rv[m] = obj[m];
  }
  return rv;
}
var concat = [].concat;
function flatten(a) {
  return concat.apply([], a);
}
var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten([8, 16, 32, 64].map((num) => ["Int", "Uint", "Float"].map((t) => t + num + "Array")))).filter((t) => _global[t]);
var intrinsicTypes = intrinsicTypeNames.map((t) => _global[t]);
arrayToObject(intrinsicTypeNames, (x) => [x, true]);
var circularRefs = null;
function deepClone(any) {
  circularRefs = typeof WeakMap !== "undefined" && /* @__PURE__ */ new WeakMap();
  const rv = innerDeepClone(any);
  circularRefs = null;
  return rv;
}
function innerDeepClone(any) {
  if (!any || typeof any !== "object")
    return any;
  let rv = circularRefs && circularRefs.get(any);
  if (rv)
    return rv;
  if (isArray(any)) {
    rv = [];
    circularRefs && circularRefs.set(any, rv);
    for (var i = 0, l = any.length; i < l; ++i) {
      rv.push(innerDeepClone(any[i]));
    }
  } else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
    rv = any;
  } else {
    const proto = getProto(any);
    rv = proto === Object.prototype ? {} : Object.create(proto);
    circularRefs && circularRefs.set(any, rv);
    for (var prop in any) {
      if (hasOwn(any, prop)) {
        rv[prop] = innerDeepClone(any[prop]);
      }
    }
  }
  return rv;
}
var { toString } = {};
function toStringTag(o) {
  return toString.call(o).slice(8, -1);
}
var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
var getIteratorOf = typeof iteratorSymbol === "symbol" ? function(x) {
  var i;
  return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function() {
  return null;
};
var NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
  var i, a, x, it;
  if (arguments.length === 1) {
    if (isArray(arrayLike))
      return arrayLike.slice();
    if (this === NO_CHAR_ARRAY && typeof arrayLike === "string")
      return [arrayLike];
    if (it = getIteratorOf(arrayLike)) {
      a = [];
      while (x = it.next(), !x.done)
        a.push(x.value);
      return a;
    }
    if (arrayLike == null)
      return [arrayLike];
    i = arrayLike.length;
    if (typeof i === "number") {
      a = new Array(i);
      while (i--)
        a[i] = arrayLike[i];
      return a;
    }
    return [arrayLike];
  }
  i = arguments.length;
  a = new Array(i);
  while (i--)
    a[i] = arguments[i];
  return a;
}
var isAsyncFunction = typeof Symbol !== "undefined" ? (fn) => fn[Symbol.toStringTag] === "AsyncFunction" : () => false;
var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
  debug = value;
  libraryFilter = filter;
}
var libraryFilter = () => true;
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
  if (NEEDS_THROW_FOR_STACK)
    try {
      getErrorWithStack.arguments;
      throw new Error();
    } catch (e) {
      return e;
    }
  return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
  var stack = exception.stack;
  if (!stack)
    return "";
  numIgnoredFrames = numIgnoredFrames || 0;
  if (stack.indexOf(exception.name) === 0)
    numIgnoredFrames += (exception.name + exception.message).split("\n").length;
  return stack.split("\n").slice(numIgnoredFrames).filter(libraryFilter).map((frame) => "\n" + frame).join("");
}
var dexieErrorNames = [
  "Modify",
  "Bulk",
  "OpenFailed",
  "VersionChange",
  "Schema",
  "Upgrade",
  "InvalidTable",
  "MissingAPI",
  "NoSuchDatabase",
  "InvalidArgument",
  "SubTransaction",
  "Unsupported",
  "Internal",
  "DatabaseClosed",
  "PrematureCommit",
  "ForeignAwait"
];
var idbDomErrorNames = [
  "Unknown",
  "Constraint",
  "Data",
  "TransactionInactive",
  "ReadOnly",
  "Version",
  "NotFound",
  "InvalidState",
  "InvalidAccess",
  "Abort",
  "Timeout",
  "QuotaExceeded",
  "Syntax",
  "DataClone"
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
  VersionChanged: "Database version changed by other database connection",
  DatabaseClosed: "Database has been closed",
  Abort: "Transaction aborted",
  TransactionInactive: "Transaction has already completed or failed",
  MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
};
function DexieError(name, msg) {
  this._e = getErrorWithStack();
  this.name = name;
  this.message = msg;
}
derive(DexieError).from(Error).extend({
  stack: {
    get: function() {
      return this._stack || (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
    }
  },
  toString: function() {
    return this.name + ": " + this.message;
  }
});
function getMultiErrorMessage(msg, failures) {
  return msg + ". Errors: " + Object.keys(failures).map((key) => failures[key].toString()).filter((v, i, s) => s.indexOf(v) === i).join("\n");
}
function ModifyError(msg, failures, successCount, failedKeys) {
  this._e = getErrorWithStack();
  this.failures = failures;
  this.failedKeys = failedKeys;
  this.successCount = successCount;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
  this._e = getErrorWithStack();
  this.name = "BulkError";
  this.failures = Object.keys(failures).map((pos) => failures[pos]);
  this.failuresByPos = failures;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce((obj, name) => (obj[name] = name + "Error", obj), {});
var BaseException = DexieError;
var exceptions = errorList.reduce((obj, name) => {
  var fullName = name + "Error";
  function DexieError2(msgOrInner, inner) {
    this._e = getErrorWithStack();
    this.name = fullName;
    if (!msgOrInner) {
      this.message = defaultTexts[name] || fullName;
      this.inner = null;
    } else if (typeof msgOrInner === "string") {
      this.message = `${msgOrInner}${!inner ? "" : "\n " + inner}`;
      this.inner = inner || null;
    } else if (typeof msgOrInner === "object") {
      this.message = `${msgOrInner.name} ${msgOrInner.message}`;
      this.inner = msgOrInner;
    }
  }
  derive(DexieError2).from(BaseException);
  obj[name] = DexieError2;
  return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce((obj, name) => {
  obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
function mapError(domError, message) {
  if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
    return domError;
  var rv = new exceptionMap[domError.name](message || domError.message, domError);
  if ("stack" in domError) {
    setProp(rv, "stack", { get: function() {
      return this.inner.stack;
    } });
  }
  return rv;
}
var fullNameExceptions = errorList.reduce((obj, name) => {
  if (["Syntax", "Type", "Range"].indexOf(name) === -1)
    obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;
function nop() {
}
function mirror(val) {
  return val;
}
function pureFunctionChain(f1, f2) {
  if (f1 == null || f1 === mirror)
    return f2;
  return function(val) {
    return f2(f1(val));
  };
}
function callBoth(on1, on2) {
  return function() {
    on1.apply(this, arguments);
    on2.apply(this, arguments);
  };
}
function hookCreatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res !== void 0)
      arguments[0] = res;
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res2 !== void 0 ? res2 : res;
  };
}
function hookDeletingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    f1.apply(this, arguments);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = this.onerror = null;
    f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
  };
}
function hookUpdatingChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function(modifications) {
    var res = f1.apply(this, arguments);
    extend(modifications, res);
    var onsuccess = this.onsuccess, onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess)
      this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror)
      this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
  };
}
function reverseStoppableEventChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    if (f2.apply(this, arguments) === false)
      return false;
    return f1.apply(this, arguments);
  };
}
function promisableChain(f1, f2) {
  if (f1 === nop)
    return f2;
  return function() {
    var res = f1.apply(this, arguments);
    if (res && typeof res.then === "function") {
      var thiz = this, i = arguments.length, args = new Array(i);
      while (i--)
        args[i] = arguments[i];
      return res.then(function() {
        return f2.apply(thiz, args);
      });
    }
    return f2.apply(this, arguments);
  };
}
var INTERNAL = {};
var LONG_STACKS_CLIP_LIMIT = 100;
var MAX_LONG_STACKS = 20;
var ZONE_ECHO_LIMIT = 100;
var [resolvedNativePromise, nativePromiseProto, resolvedGlobalPromise] = typeof Promise === "undefined" ? [] : (() => {
  let globalP = Promise.resolve();
  if (typeof crypto === "undefined" || !crypto.subtle)
    return [globalP, getProto(globalP), globalP];
  const nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
  return [
    nativeP,
    getProto(nativeP),
    globalP
  ];
})();
var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ? () => {
  resolvedGlobalPromise.then(physicalTick);
} : _global.setImmediate ? setImmediate.bind(null, physicalTick) : _global.MutationObserver ? () => {
  var hiddenDiv = document.createElement("div");
  new MutationObserver(() => {
    physicalTick();
    hiddenDiv = null;
  }).observe(hiddenDiv, { attributes: true });
  hiddenDiv.setAttribute("i", "1");
} : () => {
  setTimeout(physicalTick, 0);
};
var asap = function(callback, args) {
  microtickQueue.push([callback, args]);
  if (needsNewPhysicalTick) {
    schedulePhysicalTick();
    needsNewPhysicalTick = false;
  }
};
var isOutsideMicroTick = true;
var needsNewPhysicalTick = true;
var unhandledErrors = [];
var rejectingErrors = [];
var currentFulfiller = null;
var rejectionMapper = mirror;
var globalPSD = {
  id: "global",
  global: true,
  ref: 0,
  unhandleds: [],
  onunhandled: globalError,
  pgp: false,
  env: {},
  finalize: function() {
    this.unhandleds.forEach((uh) => {
      try {
        globalError(uh[0], uh[1]);
      } catch (e) {
      }
    });
  }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
  if (typeof this !== "object")
    throw new TypeError("Promises must be constructed via new");
  this._listeners = [];
  this.onuncatched = nop;
  this._lib = false;
  var psd = this._PSD = PSD;
  if (debug) {
    this._stackHolder = getErrorWithStack();
    this._prev = null;
    this._numPrev = 0;
  }
  if (typeof fn !== "function") {
    if (fn !== INTERNAL)
      throw new TypeError("Not a function");
    this._state = arguments[1];
    this._value = arguments[2];
    if (this._state === false)
      handleRejection(this, this._value);
    return;
  }
  this._state = null;
  this._value = null;
  ++psd.ref;
  executePromiseTask(this, fn);
}
var thenProp = {
  get: function() {
    var psd = PSD, microTaskId = totalEchoes;
    function then(onFulfilled, onRejected) {
      var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
      const cleanup = possibleAwait && !decrementExpectedAwaits();
      var rv = new DexiePromise((resolve, reject) => {
        propagateToListener(this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
      });
      debug && linkToPreviousPromise(rv, this);
      return rv;
    }
    then.prototype = INTERNAL;
    return then;
  },
  set: function(value) {
    setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
      get: function() {
        return value;
      },
      set: thenProp.set
    });
  }
};
props(DexiePromise.prototype, {
  then: thenProp,
  _then: function(onFulfilled, onRejected) {
    propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
  },
  catch: function(onRejected) {
    if (arguments.length === 1)
      return this.then(null, onRejected);
    var type2 = arguments[0], handler = arguments[1];
    return typeof type2 === "function" ? this.then(null, (err) => err instanceof type2 ? handler(err) : PromiseReject(err)) : this.then(null, (err) => err && err.name === type2 ? handler(err) : PromiseReject(err));
  },
  finally: function(onFinally) {
    return this.then((value) => {
      onFinally();
      return value;
    }, (err) => {
      onFinally();
      return PromiseReject(err);
    });
  },
  stack: {
    get: function() {
      if (this._stack)
        return this._stack;
      try {
        stack_being_generated = true;
        var stacks = getStack(this, [], MAX_LONG_STACKS);
        var stack = stacks.join("\nFrom previous: ");
        if (this._state !== null)
          this._stack = stack;
        return stack;
      } finally {
        stack_being_generated = false;
      }
    }
  },
  timeout: function(ms, msg) {
    return ms < Infinity ? new DexiePromise((resolve, reject) => {
      var handle = setTimeout(() => reject(new exceptions.Timeout(msg)), ms);
      this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
    }) : this;
  }
});
if (typeof Symbol !== "undefined" && Symbol.toStringTag)
  setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.resolve = resolve;
  this.reject = reject;
  this.psd = zone;
}
props(DexiePromise, {
  all: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(function(resolve, reject) {
      if (values.length === 0)
        resolve([]);
      var remaining = values.length;
      values.forEach((a, i) => DexiePromise.resolve(a).then((x) => {
        values[i] = x;
        if (!--remaining)
          resolve(values);
      }, reject));
    });
  },
  resolve: (value) => {
    if (value instanceof DexiePromise)
      return value;
    if (value && typeof value.then === "function")
      return new DexiePromise((resolve, reject) => {
        value.then(resolve, reject);
      });
    var rv = new DexiePromise(INTERNAL, true, value);
    linkToPreviousPromise(rv, currentFulfiller);
    return rv;
  },
  reject: PromiseReject,
  race: function() {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise((resolve, reject) => {
      values.map((value) => DexiePromise.resolve(value).then(resolve, reject));
    });
  },
  PSD: {
    get: () => PSD,
    set: (value) => PSD = value
  },
  totalEchoes: { get: () => totalEchoes },
  newPSD: newScope,
  usePSD,
  scheduler: {
    get: () => asap,
    set: (value) => {
      asap = value;
    }
  },
  rejectionMapper: {
    get: () => rejectionMapper,
    set: (value) => {
      rejectionMapper = value;
    }
  },
  follow: (fn, zoneProps) => {
    return new DexiePromise((resolve, reject) => {
      return newScope((resolve2, reject2) => {
        var psd = PSD;
        psd.unhandleds = [];
        psd.onunhandled = reject2;
        psd.finalize = callBoth(function() {
          run_at_end_of_this_or_next_physical_tick(() => {
            this.unhandleds.length === 0 ? resolve2() : reject2(this.unhandleds[0]);
          });
        }, psd.finalize);
        fn();
      }, zoneProps, resolve, reject);
    });
  }
});
if (NativePromise) {
  if (NativePromise.allSettled)
    setProp(DexiePromise, "allSettled", function() {
      const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise((resolve) => {
        if (possiblePromises.length === 0)
          resolve([]);
        let remaining = possiblePromises.length;
        const results = new Array(remaining);
        possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then((value) => results[i] = { status: "fulfilled", value }, (reason) => results[i] = { status: "rejected", reason }).then(() => --remaining || resolve(results)));
      });
    });
  if (NativePromise.any && typeof AggregateError !== "undefined")
    setProp(DexiePromise, "any", function() {
      const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
      return new DexiePromise((resolve, reject) => {
        if (possiblePromises.length === 0)
          reject(new AggregateError([]));
        let remaining = possiblePromises.length;
        const failures = new Array(remaining);
        possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then((value) => resolve(value), (failure) => {
          failures[i] = failure;
          if (!--remaining)
            reject(new AggregateError(failures));
        }));
      });
    });
}
function executePromiseTask(promise, fn) {
  try {
    fn((value) => {
      if (promise._state !== null)
        return;
      if (value === promise)
        throw new TypeError("A promise cannot be resolved with itself.");
      var shouldExecuteTick = promise._lib && beginMicroTickScope();
      if (value && typeof value.then === "function") {
        executePromiseTask(promise, (resolve, reject) => {
          value instanceof DexiePromise ? value._then(resolve, reject) : value.then(resolve, reject);
        });
      } else {
        promise._state = true;
        promise._value = value;
        propagateAllListeners(promise);
      }
      if (shouldExecuteTick)
        endMicroTickScope();
    }, handleRejection.bind(null, promise));
  } catch (ex) {
    handleRejection(promise, ex);
  }
}
function handleRejection(promise, reason) {
  rejectingErrors.push(reason);
  if (promise._state !== null)
    return;
  var shouldExecuteTick = promise._lib && beginMicroTickScope();
  reason = rejectionMapper(reason);
  promise._state = false;
  promise._value = reason;
  debug && reason !== null && typeof reason === "object" && !reason._promise && tryCatch(() => {
    var origProp = getPropertyDescriptor(reason, "stack");
    reason._promise = promise;
    setProp(reason, "stack", {
      get: () => stack_being_generated ? origProp && (origProp.get ? origProp.get.apply(reason) : origProp.value) : promise.stack
    });
  });
  addPossiblyUnhandledError(promise);
  propagateAllListeners(promise);
  if (shouldExecuteTick)
    endMicroTickScope();
}
function propagateAllListeners(promise) {
  var listeners = promise._listeners;
  promise._listeners = [];
  for (var i = 0, len = listeners.length; i < len; ++i) {
    propagateToListener(promise, listeners[i]);
  }
  var psd = promise._PSD;
  --psd.ref || psd.finalize();
  if (numScheduledCalls === 0) {
    ++numScheduledCalls;
    asap(() => {
      if (--numScheduledCalls === 0)
        finalizePhysicalTick();
    }, []);
  }
}
function propagateToListener(promise, listener) {
  if (promise._state === null) {
    promise._listeners.push(listener);
    return;
  }
  var cb = promise._state ? listener.onFulfilled : listener.onRejected;
  if (cb === null) {
    return (promise._state ? listener.resolve : listener.reject)(promise._value);
  }
  ++listener.psd.ref;
  ++numScheduledCalls;
  asap(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
  try {
    currentFulfiller = promise;
    var ret, value = promise._value;
    if (promise._state) {
      ret = cb(value);
    } else {
      if (rejectingErrors.length)
        rejectingErrors = [];
      ret = cb(value);
      if (rejectingErrors.indexOf(value) === -1)
        markErrorAsHandled(promise);
    }
    listener.resolve(ret);
  } catch (e) {
    listener.reject(e);
  } finally {
    currentFulfiller = null;
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
    --listener.psd.ref || listener.psd.finalize();
  }
}
function getStack(promise, stacks, limit) {
  if (stacks.length === limit)
    return stacks;
  var stack = "";
  if (promise._state === false) {
    var failure = promise._value, errorName, message;
    if (failure != null) {
      errorName = failure.name || "Error";
      message = failure.message || failure;
      stack = prettyStack(failure, 0);
    } else {
      errorName = failure;
      message = "";
    }
    stacks.push(errorName + (message ? ": " + message : "") + stack);
  }
  if (debug) {
    stack = prettyStack(promise._stackHolder, 2);
    if (stack && stacks.indexOf(stack) === -1)
      stacks.push(stack);
    if (promise._prev)
      getStack(promise._prev, stacks, limit);
  }
  return stacks;
}
function linkToPreviousPromise(promise, prev) {
  var numPrev = prev ? prev._numPrev + 1 : 0;
  if (numPrev < LONG_STACKS_CLIP_LIMIT) {
    promise._prev = prev;
    promise._numPrev = numPrev;
  }
}
function physicalTick() {
  beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
  var wasRootExec = isOutsideMicroTick;
  isOutsideMicroTick = false;
  needsNewPhysicalTick = false;
  return wasRootExec;
}
function endMicroTickScope() {
  var callbacks, i, l;
  do {
    while (microtickQueue.length > 0) {
      callbacks = microtickQueue;
      microtickQueue = [];
      l = callbacks.length;
      for (i = 0; i < l; ++i) {
        var item = callbacks[i];
        item[0].apply(null, item[1]);
      }
    }
  } while (microtickQueue.length > 0);
  isOutsideMicroTick = true;
  needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
  var unhandledErrs = unhandledErrors;
  unhandledErrors = [];
  unhandledErrs.forEach((p) => {
    p._PSD.onunhandled.call(null, p._value, p);
  });
  var finalizers = tickFinalizers.slice(0);
  var i = finalizers.length;
  while (i)
    finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
  function finalizer() {
    fn();
    tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
  }
  tickFinalizers.push(finalizer);
  ++numScheduledCalls;
  asap(() => {
    if (--numScheduledCalls === 0)
      finalizePhysicalTick();
  }, []);
}
function addPossiblyUnhandledError(promise) {
  if (!unhandledErrors.some((p) => p._value === promise._value))
    unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
  var i = unhandledErrors.length;
  while (i)
    if (unhandledErrors[--i]._value === promise._value) {
      unhandledErrors.splice(i, 1);
      return;
    }
}
function PromiseReject(reason) {
  return new DexiePromise(INTERNAL, false, reason);
}
function wrap2(fn, errorCatcher) {
  var psd = PSD;
  return function() {
    var wasRootExec = beginMicroTickScope(), outerScope = PSD;
    try {
      switchToZone(psd, true);
      return fn.apply(this, arguments);
    } catch (e) {
      errorCatcher && errorCatcher(e);
    } finally {
      switchToZone(outerScope, false);
      if (wasRootExec)
        endMicroTickScope();
    }
  };
}
var task = { awaits: 0, echoes: 0, id: 0 };
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props2, a1, a2) {
  var parent = PSD, psd = Object.create(parent);
  psd.parent = parent;
  psd.ref = 0;
  psd.global = false;
  psd.id = ++zone_id_counter;
  var globalEnv = globalPSD.env;
  psd.env = patchGlobalPromise ? {
    Promise: DexiePromise,
    PromiseProp: { value: DexiePromise, configurable: true, writable: true },
    all: DexiePromise.all,
    race: DexiePromise.race,
    allSettled: DexiePromise.allSettled,
    any: DexiePromise.any,
    resolve: DexiePromise.resolve,
    reject: DexiePromise.reject,
    nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
    gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
  } : {};
  if (props2)
    extend(psd, props2);
  ++parent.ref;
  psd.finalize = function() {
    --this.parent.ref || this.parent.finalize();
  };
  var rv = usePSD(psd, fn, a1, a2);
  if (psd.ref === 0)
    psd.finalize();
  return rv;
}
function incrementExpectedAwaits() {
  if (!task.id)
    task.id = ++taskCounter;
  ++task.awaits;
  task.echoes += ZONE_ECHO_LIMIT;
  return task.id;
}
function decrementExpectedAwaits() {
  if (!task.awaits)
    return false;
  if (--task.awaits === 0)
    task.id = 0;
  task.echoes = task.awaits * ZONE_ECHO_LIMIT;
  return true;
}
if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
  incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
  if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
    incrementExpectedAwaits();
    return possiblePromise.then((x) => {
      decrementExpectedAwaits();
      return x;
    }, (e) => {
      decrementExpectedAwaits();
      return rejection(e);
    });
  }
  return possiblePromise;
}
function zoneEnterEcho(targetZone) {
  ++totalEchoes;
  if (!task.echoes || --task.echoes === 0) {
    task.echoes = task.id = 0;
  }
  zoneStack.push(PSD);
  switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
  var zone = zoneStack[zoneStack.length - 1];
  zoneStack.pop();
  switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
  var currentZone = PSD;
  if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
    enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
  }
  if (targetZone === PSD)
    return;
  PSD = targetZone;
  if (currentZone === globalPSD)
    globalPSD.env = snapShot();
  if (patchGlobalPromise) {
    var GlobalPromise = globalPSD.env.Promise;
    var targetEnv = targetZone.env;
    nativePromiseProto.then = targetEnv.nthen;
    GlobalPromise.prototype.then = targetEnv.gthen;
    if (currentZone.global || targetZone.global) {
      Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
      GlobalPromise.all = targetEnv.all;
      GlobalPromise.race = targetEnv.race;
      GlobalPromise.resolve = targetEnv.resolve;
      GlobalPromise.reject = targetEnv.reject;
      if (targetEnv.allSettled)
        GlobalPromise.allSettled = targetEnv.allSettled;
      if (targetEnv.any)
        GlobalPromise.any = targetEnv.any;
    }
  }
}
function snapShot() {
  var GlobalPromise = _global.Promise;
  return patchGlobalPromise ? {
    Promise: GlobalPromise,
    PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
    all: GlobalPromise.all,
    race: GlobalPromise.race,
    allSettled: GlobalPromise.allSettled,
    any: GlobalPromise.any,
    resolve: GlobalPromise.resolve,
    reject: GlobalPromise.reject,
    nthen: nativePromiseProto.then,
    gthen: GlobalPromise.prototype.then
  } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
  var outerScope = PSD;
  try {
    switchToZone(psd, true);
    return fn(a1, a2, a3);
  } finally {
    switchToZone(outerScope, false);
  }
}
function enqueueNativeMicroTask(job) {
  nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
  return typeof fn !== "function" ? fn : function() {
    var outerZone = PSD;
    if (possibleAwait)
      incrementExpectedAwaits();
    switchToZone(zone, true);
    try {
      return fn.apply(this, arguments);
    } finally {
      switchToZone(outerZone, false);
      if (cleanup)
        enqueueNativeMicroTask(decrementExpectedAwaits);
    }
  };
}
function getPatchedPromiseThen(origThen, zone) {
  return function(onResolved, onRejected) {
    return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
  };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
  var rv;
  try {
    rv = promise.onuncatched(err);
  } catch (e) {
  }
  if (rv !== false)
    try {
      var event, eventData = { promise, reason: err };
      if (_global.document && document.createEvent) {
        event = document.createEvent("Event");
        event.initEvent(UNHANDLEDREJECTION, true, true);
        extend(event, eventData);
      } else if (_global.CustomEvent) {
        event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
        extend(event, eventData);
      }
      if (event && _global.dispatchEvent) {
        dispatchEvent(event);
        if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
          try {
            _global.onunhandledrejection(event);
          } catch (_) {
          }
      }
      if (debug && event && !event.defaultPrevented) {
        console.warn(`Unhandled rejection: ${err.stack || err}`);
      }
    } catch (e) {
    }
}
var rejection = DexiePromise.reject;
function tempTransaction(db, mode, storeNames, fn) {
  if (!db.idbdb || !db._state.openComplete && (!PSD.letThrough && !db._vip)) {
    if (db._state.openComplete) {
      return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
    }
    if (!db._state.isBeingOpened) {
      if (!db._options.autoOpen)
        return rejection(new exceptions.DatabaseClosed());
      db.open().catch(nop);
    }
    return db._state.dbReadyPromise.then(() => tempTransaction(db, mode, storeNames, fn));
  } else {
    var trans = db._createTransaction(mode, storeNames, db._dbSchema);
    try {
      trans.create();
      db._state.PR1398_maxLoop = 3;
    } catch (ex) {
      if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
        console.warn("Dexie: Need to reopen db");
        db._close();
        return db.open().then(() => tempTransaction(db, mode, storeNames, fn));
      }
      return rejection(ex);
    }
    return trans._promise(mode, (resolve, reject) => {
      return newScope(() => {
        PSD.trans = trans;
        return fn(resolve, reject, trans);
      });
    }).then((result) => {
      return trans._completion.then(() => result);
    });
  }
}
var DEXIE_VERSION = "3.2.4";
var maxString = String.fromCharCode(65535);
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== "undefined" && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = (frame) => !/(dexie\.js|dexie\.min\.js)/.test(frame);
var DBNAMES_DB = "__dbnames";
var READONLY = "readonly";
var READWRITE = "readwrite";
function combine(filter1, filter2) {
  return filter1 ? filter2 ? function() {
    return filter1.apply(this, arguments) && filter2.apply(this, arguments);
  } : filter1 : filter2;
}
var AnyRange = {
  type: 3,
  lower: -Infinity,
  lowerOpen: false,
  upper: [[]],
  upperOpen: false
};
function workaroundForUndefinedPrimKey(keyPath) {
  return typeof keyPath === "string" && !/\./.test(keyPath) ? (obj) => {
    if (obj[keyPath] === void 0 && keyPath in obj) {
      obj = deepClone(obj);
      delete obj[keyPath];
    }
    return obj;
  } : (obj) => obj;
}
var Table = class {
  _trans(mode, fn, writeLocked) {
    const trans = this._tx || PSD.trans;
    const tableName = this.name;
    function checkTableInTransaction(resolve, reject, trans2) {
      if (!trans2.schema[tableName])
        throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
      return fn(trans2.idbtrans, trans2);
    }
    const wasRootExec = beginMicroTickScope();
    try {
      return trans && trans.db === this.db ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(() => trans._promise(mode, checkTableInTransaction, writeLocked), { trans, transless: PSD.transless || PSD }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
    } finally {
      if (wasRootExec)
        endMicroTickScope();
    }
  }
  get(keyOrCrit, cb) {
    if (keyOrCrit && keyOrCrit.constructor === Object)
      return this.where(keyOrCrit).first(cb);
    return this._trans("readonly", (trans) => {
      return this.core.get({ trans, key: keyOrCrit }).then((res) => this.hook.reading.fire(res));
    }).then(cb);
  }
  where(indexOrCrit) {
    if (typeof indexOrCrit === "string")
      return new this.db.WhereClause(this, indexOrCrit);
    if (isArray(indexOrCrit))
      return new this.db.WhereClause(this, `[${indexOrCrit.join("+")}]`);
    const keyPaths = keys(indexOrCrit);
    if (keyPaths.length === 1)
      return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
    const compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter((ix) => ix.compound && keyPaths.every((keyPath) => ix.keyPath.indexOf(keyPath) >= 0) && ix.keyPath.every((keyPath) => keyPaths.indexOf(keyPath) >= 0))[0];
    if (compoundIndex && this.db._maxKey !== maxString)
      return this.where(compoundIndex.name).equals(compoundIndex.keyPath.map((kp) => indexOrCrit[kp]));
    if (!compoundIndex && debug)
      console.warn(`The query ${JSON.stringify(indexOrCrit)} on ${this.name} would benefit of a compound index [${keyPaths.join("+")}]`);
    const { idxByName } = this.schema;
    const idb = this.db._deps.indexedDB;
    function equals(a, b2) {
      try {
        return idb.cmp(a, b2) === 0;
      } catch (e) {
        return false;
      }
    }
    const [idx, filterFunction] = keyPaths.reduce(([prevIndex, prevFilterFn], keyPath) => {
      const index = idxByName[keyPath];
      const value = indexOrCrit[keyPath];
      return [
        prevIndex || index,
        prevIndex || !index ? combine(prevFilterFn, index && index.multi ? (x) => {
          const prop = getByKeyPath(x, keyPath);
          return isArray(prop) && prop.some((item) => equals(value, item));
        } : (x) => equals(value, getByKeyPath(x, keyPath))) : prevFilterFn
      ];
    }, [null, null]);
    return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
  }
  filter(filterFunction) {
    return this.toCollection().and(filterFunction);
  }
  count(thenShortcut) {
    return this.toCollection().count(thenShortcut);
  }
  offset(offset) {
    return this.toCollection().offset(offset);
  }
  limit(numRows) {
    return this.toCollection().limit(numRows);
  }
  each(callback) {
    return this.toCollection().each(callback);
  }
  toArray(thenShortcut) {
    return this.toCollection().toArray(thenShortcut);
  }
  toCollection() {
    return new this.db.Collection(new this.db.WhereClause(this));
  }
  orderBy(index) {
    return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? `[${index.join("+")}]` : index));
  }
  reverse() {
    return this.toCollection().reverse();
  }
  mapToClass(constructor) {
    this.schema.mappedClass = constructor;
    const readHook = (obj) => {
      if (!obj)
        return obj;
      const res = Object.create(constructor.prototype);
      for (var m in obj)
        if (hasOwn(obj, m))
          try {
            res[m] = obj[m];
          } catch (_) {
          }
      return res;
    };
    if (this.schema.readHook) {
      this.hook.reading.unsubscribe(this.schema.readHook);
    }
    this.schema.readHook = readHook;
    this.hook("reading", readHook);
    return constructor;
  }
  defineClass() {
    function Class(content) {
      extend(this, content);
    }
    return this.mapToClass(Class);
  }
  add(obj, key) {
    const { auto, keyPath } = this.schema.primKey;
    let objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", (trans) => {
      return this.core.mutate({ trans, type: "add", keys: key != null ? [key] : null, values: [objToAdd] });
    }).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult).then((lastResult) => {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  }
  update(keyOrObject, modifications) {
    if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
      const key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
      if (key === void 0)
        return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
      try {
        if (typeof modifications !== "function") {
          keys(modifications).forEach((keyPath) => {
            setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
          });
        } else {
          modifications(keyOrObject, { value: keyOrObject, primKey: key });
        }
      } catch (_a) {
      }
      return this.where(":id").equals(key).modify(modifications);
    } else {
      return this.where(":id").equals(keyOrObject).modify(modifications);
    }
  }
  put(obj, key) {
    const { auto, keyPath } = this.schema.primKey;
    let objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "put", values: [objToAdd], keys: key != null ? [key] : null })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult).then((lastResult) => {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {
        }
      }
      return lastResult;
    });
  }
  delete(key) {
    return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "delete", keys: [key] })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0);
  }
  clear() {
    return this._trans("readwrite", (trans) => this.core.mutate({ trans, type: "deleteRange", range: AnyRange })).then((res) => res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0);
  }
  bulkGet(keys2) {
    return this._trans("readonly", (trans) => {
      return this.core.getMany({
        keys: keys2,
        trans
      }).then((result) => result.map((res) => this.hook.reading.fire(res)));
    });
  }
  bulkAdd(objects, keysOrOptions, options) {
    const keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    const wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", (trans) => {
      const { auto, keyPath } = this.schema.primKey;
      if (keyPath && keys2)
        throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      const numObjects = objects.length;
      let objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return this.core.mutate({ trans, type: "add", keys: keys2, values: objectsToAdd, wantResults }).then(({ numFailures, results, lastResult, failures }) => {
        const result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(`${this.name}.bulkAdd(): ${numFailures} of ${numObjects} operations failed`, failures);
      });
    });
  }
  bulkPut(objects, keysOrOptions, options) {
    const keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    const wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", (trans) => {
      const { auto, keyPath } = this.schema.primKey;
      if (keyPath && keys2)
        throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length)
        throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      const numObjects = objects.length;
      let objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return this.core.mutate({ trans, type: "put", keys: keys2, values: objectsToPut, wantResults }).then(({ numFailures, results, lastResult, failures }) => {
        const result = wantResults ? results : lastResult;
        if (numFailures === 0)
          return result;
        throw new BulkError(`${this.name}.bulkPut(): ${numFailures} of ${numObjects} operations failed`, failures);
      });
    });
  }
  bulkDelete(keys2) {
    const numKeys = keys2.length;
    return this._trans("readwrite", (trans) => {
      return this.core.mutate({ trans, type: "delete", keys: keys2 });
    }).then(({ numFailures, lastResult, failures }) => {
      if (numFailures === 0)
        return lastResult;
      throw new BulkError(`${this.name}.bulkDelete(): ${numFailures} of ${numKeys} operations failed`, failures);
    });
  }
};
function Events(ctx) {
  var evs = {};
  var rv = function(eventName, subscriber) {
    if (subscriber) {
      var i2 = arguments.length, args = new Array(i2 - 1);
      while (--i2)
        args[i2 - 1] = arguments[i2];
      evs[eventName].subscribe.apply(null, args);
      return ctx;
    } else if (typeof eventName === "string") {
      return evs[eventName];
    }
  };
  rv.addEventType = add;
  for (var i = 1, l = arguments.length; i < l; ++i) {
    add(arguments[i]);
  }
  return rv;
  function add(eventName, chainFunction, defaultFunction) {
    if (typeof eventName === "object")
      return addConfiguredEvents(eventName);
    if (!chainFunction)
      chainFunction = reverseStoppableEventChain;
    if (!defaultFunction)
      defaultFunction = nop;
    var context = {
      subscribers: [],
      fire: defaultFunction,
      subscribe: function(cb) {
        if (context.subscribers.indexOf(cb) === -1) {
          context.subscribers.push(cb);
          context.fire = chainFunction(context.fire, cb);
        }
      },
      unsubscribe: function(cb) {
        context.subscribers = context.subscribers.filter(function(fn) {
          return fn !== cb;
        });
        context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
      }
    };
    evs[eventName] = rv[eventName] = context;
    return context;
  }
  function addConfiguredEvents(cfg) {
    keys(cfg).forEach(function(eventName) {
      var args = cfg[eventName];
      if (isArray(args)) {
        add(eventName, cfg[eventName][0], cfg[eventName][1]);
      } else if (args === "asap") {
        var context = add(eventName, mirror, function fire() {
          var i2 = arguments.length, args2 = new Array(i2);
          while (i2--)
            args2[i2] = arguments[i2];
          context.subscribers.forEach(function(fn) {
            asap$1(function fireEvent() {
              fn.apply(null, args2);
            });
          });
        });
      } else
        throw new exceptions.InvalidArgument("Invalid event config");
    });
  }
}
function makeClassConstructor(prototype, constructor) {
  derive(constructor).from({ prototype });
  return constructor;
}
function createTableConstructor(db) {
  return makeClassConstructor(Table.prototype, function Table2(name, tableSchema, trans) {
    this.db = db;
    this._tx = trans;
    this.name = name;
    this.schema = tableSchema;
    this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
      "creating": [hookCreatingChain, nop],
      "reading": [pureFunctionChain, mirror],
      "updating": [hookUpdatingChain, nop],
      "deleting": [hookDeletingChain, nop]
    });
  });
}
function isPlainKeyRange(ctx, ignoreLimitFilter) {
  return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
  ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
  var curr = ctx.replayFilter;
  ctx.replayFilter = curr ? () => combine(curr(), factory()) : factory;
  ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
  ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
  if (ctx.isPrimKey)
    return coreSchema.primaryKey;
  const index = coreSchema.getIndexByKeyPath(ctx.index);
  if (!index)
    throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
  return index;
}
function openCursor(ctx, coreTable, trans) {
  const index = getIndexOrStore(ctx, coreTable.schema);
  return coreTable.openCursor({
    trans,
    values: !ctx.keysOnly,
    reverse: ctx.dir === "prev",
    unique: !!ctx.unique,
    query: {
      index,
      range: ctx.range
    }
  });
}
function iter(ctx, fn, coreTrans, coreTable) {
  const filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
  if (!ctx.or) {
    return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
  } else {
    const set = {};
    const union = (item, cursor, advance) => {
      if (!filter || filter(cursor, advance, (result) => cursor.stop(result), (err) => cursor.fail(err))) {
        var primaryKey = cursor.primaryKey;
        var key = "" + primaryKey;
        if (key === "[object ArrayBuffer]")
          key = "" + new Uint8Array(primaryKey);
        if (!hasOwn(set, key)) {
          set[key] = true;
          fn(item, cursor, advance);
        }
      }
    };
    return Promise.all([
      ctx.or._iterate(union, coreTrans),
      iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)
    ]);
  }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
  var mappedFn = valueMapper ? (x, c, a) => fn(valueMapper(x), c, a) : fn;
  var wrappedFn = wrap2(mappedFn);
  return cursorPromise.then((cursor) => {
    if (cursor) {
      return cursor.start(() => {
        var c = () => cursor.continue();
        if (!filter || filter(cursor, (advancer) => c = advancer, (val) => {
          cursor.stop(val);
          c = nop;
        }, (e) => {
          cursor.fail(e);
          c = nop;
        }))
          wrappedFn(cursor.value, cursor, (advancer) => c = advancer);
        c();
      });
    }
  });
}
function cmp(a, b2) {
  try {
    const ta = type(a);
    const tb = type(b2);
    if (ta !== tb) {
      if (ta === "Array")
        return 1;
      if (tb === "Array")
        return -1;
      if (ta === "binary")
        return 1;
      if (tb === "binary")
        return -1;
      if (ta === "string")
        return 1;
      if (tb === "string")
        return -1;
      if (ta === "Date")
        return 1;
      if (tb !== "Date")
        return NaN;
      return -1;
    }
    switch (ta) {
      case "number":
      case "Date":
      case "string":
        return a > b2 ? 1 : a < b2 ? -1 : 0;
      case "binary": {
        return compareUint8Arrays(getUint8Array(a), getUint8Array(b2));
      }
      case "Array":
        return compareArrays(a, b2);
    }
  } catch (_a) {
  }
  return NaN;
}
function compareArrays(a, b2) {
  const al = a.length;
  const bl = b2.length;
  const l = al < bl ? al : bl;
  for (let i = 0; i < l; ++i) {
    const res = cmp(a[i], b2[i]);
    if (res !== 0)
      return res;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function compareUint8Arrays(a, b2) {
  const al = a.length;
  const bl = b2.length;
  const l = al < bl ? al : bl;
  for (let i = 0; i < l; ++i) {
    if (a[i] !== b2[i])
      return a[i] < b2[i] ? -1 : 1;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function type(x) {
  const t = typeof x;
  if (t !== "object")
    return t;
  if (ArrayBuffer.isView(x))
    return "binary";
  const tsTag = toStringTag(x);
  return tsTag === "ArrayBuffer" ? "binary" : tsTag;
}
function getUint8Array(a) {
  if (a instanceof Uint8Array)
    return a;
  if (ArrayBuffer.isView(a))
    return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  return new Uint8Array(a);
}
var Collection = class {
  _read(fn, cb) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
  }
  _write(fn) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
  }
  _addAlgorithm(fn) {
    var ctx = this._ctx;
    ctx.algorithm = combine(ctx.algorithm, fn);
  }
  _iterate(fn, coreTrans) {
    return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
  }
  clone(props2) {
    var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
    if (props2)
      extend(ctx, props2);
    rv._ctx = ctx;
    return rv;
  }
  raw() {
    this._ctx.valueMapper = null;
    return this;
  }
  each(fn) {
    var ctx = this._ctx;
    return this._read((trans) => iter(ctx, fn, trans, ctx.table.core));
  }
  count(cb) {
    return this._read((trans) => {
      const ctx = this._ctx;
      const coreTable = ctx.table.core;
      if (isPlainKeyRange(ctx, true)) {
        return coreTable.count({
          trans,
          query: {
            index: getIndexOrStore(ctx, coreTable.schema),
            range: ctx.range
          }
        }).then((count2) => Math.min(count2, ctx.limit));
      } else {
        var count = 0;
        return iter(ctx, () => {
          ++count;
          return false;
        }, trans, coreTable).then(() => count);
      }
    }).then(cb);
  }
  sortBy(keyPath, cb) {
    const parts = keyPath.split(".").reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
    function getval(obj, i) {
      if (i)
        return getval(obj[parts[i]], i - 1);
      return obj[lastPart];
    }
    var order = this._ctx.dir === "next" ? 1 : -1;
    function sorter(a, b2) {
      var aVal = getval(a, lastIndex), bVal = getval(b2, lastIndex);
      return aVal < bVal ? -order : aVal > bVal ? order : 0;
    }
    return this.toArray(function(a) {
      return a.sort(sorter);
    }).then(cb);
  }
  toArray(cb) {
    return this._read((trans) => {
      var ctx = this._ctx;
      if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
        const { valueMapper } = ctx;
        const index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          limit: ctx.limit,
          values: true,
          query: {
            index,
            range: ctx.range
          }
        }).then(({ result }) => valueMapper ? result.map(valueMapper) : result);
      } else {
        const a = [];
        return iter(ctx, (item) => a.push(item), trans, ctx.table.core).then(() => a);
      }
    }, cb);
  }
  offset(offset) {
    var ctx = this._ctx;
    if (offset <= 0)
      return this;
    ctx.offset += offset;
    if (isPlainKeyRange(ctx)) {
      addReplayFilter(ctx, () => {
        var offsetLeft = offset;
        return (cursor, advance) => {
          if (offsetLeft === 0)
            return true;
          if (offsetLeft === 1) {
            --offsetLeft;
            return false;
          }
          advance(() => {
            cursor.advance(offsetLeft);
            offsetLeft = 0;
          });
          return false;
        };
      });
    } else {
      addReplayFilter(ctx, () => {
        var offsetLeft = offset;
        return () => --offsetLeft < 0;
      });
    }
    return this;
  }
  limit(numRows) {
    this._ctx.limit = Math.min(this._ctx.limit, numRows);
    addReplayFilter(this._ctx, () => {
      var rowsLeft = numRows;
      return function(cursor, advance, resolve) {
        if (--rowsLeft <= 0)
          advance(resolve);
        return rowsLeft >= 0;
      };
    }, true);
    return this;
  }
  until(filterFunction, bIncludeStopEntry) {
    addFilter(this._ctx, function(cursor, advance, resolve) {
      if (filterFunction(cursor.value)) {
        advance(resolve);
        return bIncludeStopEntry;
      } else {
        return true;
      }
    });
    return this;
  }
  first(cb) {
    return this.limit(1).toArray(function(a) {
      return a[0];
    }).then(cb);
  }
  last(cb) {
    return this.reverse().first(cb);
  }
  filter(filterFunction) {
    addFilter(this._ctx, function(cursor) {
      return filterFunction(cursor.value);
    });
    addMatchFilter(this._ctx, filterFunction);
    return this;
  }
  and(filter) {
    return this.filter(filter);
  }
  or(indexName) {
    return new this.db.WhereClause(this._ctx.table, indexName, this);
  }
  reverse() {
    this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
    if (this._ondirectionchange)
      this._ondirectionchange(this._ctx.dir);
    return this;
  }
  desc() {
    return this.reverse();
  }
  eachKey(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.key, cursor);
    });
  }
  eachUniqueKey(cb) {
    this._ctx.unique = "unique";
    return this.eachKey(cb);
  }
  eachPrimaryKey(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function(val, cursor) {
      cb(cursor.primaryKey, cursor);
    });
  }
  keys(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.key);
    }).then(function() {
      return a;
    }).then(cb);
  }
  primaryKeys(cb) {
    var ctx = this._ctx;
    if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
      return this._read((trans) => {
        var index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          values: false,
          limit: ctx.limit,
          query: {
            index,
            range: ctx.range
          }
        });
      }).then(({ result }) => result).then(cb);
    }
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function(item, cursor) {
      a.push(cursor.primaryKey);
    }).then(function() {
      return a;
    }).then(cb);
  }
  uniqueKeys(cb) {
    this._ctx.unique = "unique";
    return this.keys(cb);
  }
  firstKey(cb) {
    return this.limit(1).keys(function(a) {
      return a[0];
    }).then(cb);
  }
  lastKey(cb) {
    return this.reverse().firstKey(cb);
  }
  distinct() {
    var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
    if (!idx || !idx.multi)
      return this;
    var set = {};
    addFilter(this._ctx, function(cursor) {
      var strKey = cursor.primaryKey.toString();
      var found = hasOwn(set, strKey);
      set[strKey] = true;
      return !found;
    });
    return this;
  }
  modify(changes) {
    var ctx = this._ctx;
    return this._write((trans) => {
      var modifyer;
      if (typeof changes === "function") {
        modifyer = changes;
      } else {
        var keyPaths = keys(changes);
        var numKeys = keyPaths.length;
        modifyer = function(item) {
          var anythingModified = false;
          for (var i = 0; i < numKeys; ++i) {
            var keyPath = keyPaths[i], val = changes[keyPath];
            if (getByKeyPath(item, keyPath) !== val) {
              setByKeyPath(item, keyPath, val);
              anythingModified = true;
            }
          }
          return anythingModified;
        };
      }
      const coreTable = ctx.table.core;
      const { outbound, extractKey } = coreTable.schema.primaryKey;
      const limit = this.db._options.modifyChunkSize || 200;
      const totalFailures = [];
      let successCount = 0;
      const failedKeys = [];
      const applyMutateResult = (expectedCount, res) => {
        const { failures, numFailures } = res;
        successCount += expectedCount - numFailures;
        for (let pos of keys(failures)) {
          totalFailures.push(failures[pos]);
        }
      };
      return this.clone().primaryKeys().then((keys2) => {
        const nextChunk = (offset) => {
          const count = Math.min(limit, keys2.length - offset);
          return coreTable.getMany({
            trans,
            keys: keys2.slice(offset, offset + count),
            cache: "immutable"
          }).then((values) => {
            const addValues = [];
            const putValues = [];
            const putKeys = outbound ? [] : null;
            const deleteKeys = [];
            for (let i = 0; i < count; ++i) {
              const origValue = values[i];
              const ctx2 = {
                value: deepClone(origValue),
                primKey: keys2[offset + i]
              };
              if (modifyer.call(ctx2, ctx2.value, ctx2) !== false) {
                if (ctx2.value == null) {
                  deleteKeys.push(keys2[offset + i]);
                } else if (!outbound && cmp(extractKey(origValue), extractKey(ctx2.value)) !== 0) {
                  deleteKeys.push(keys2[offset + i]);
                  addValues.push(ctx2.value);
                } else {
                  putValues.push(ctx2.value);
                  if (outbound)
                    putKeys.push(keys2[offset + i]);
                }
              }
            }
            const criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || changes === deleteCallback) && {
              index: ctx.index,
              range: ctx.range
            };
            return Promise.resolve(addValues.length > 0 && coreTable.mutate({ trans, type: "add", values: addValues }).then((res) => {
              for (let pos in res.failures) {
                deleteKeys.splice(parseInt(pos), 1);
              }
              applyMutateResult(addValues.length, res);
            })).then(() => (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
              trans,
              type: "put",
              keys: putKeys,
              values: putValues,
              criteria,
              changeSpec: typeof changes !== "function" && changes
            }).then((res) => applyMutateResult(putValues.length, res))).then(() => (deleteKeys.length > 0 || criteria && changes === deleteCallback) && coreTable.mutate({
              trans,
              type: "delete",
              keys: deleteKeys,
              criteria
            }).then((res) => applyMutateResult(deleteKeys.length, res))).then(() => {
              return keys2.length > offset + count && nextChunk(offset + limit);
            });
          });
        };
        return nextChunk(0).then(() => {
          if (totalFailures.length > 0)
            throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
          return keys2.length;
        });
      });
    });
  }
  delete() {
    var ctx = this._ctx, range = ctx.range;
    if (isPlainKeyRange(ctx) && (ctx.isPrimKey && !hangsOnDeleteLargeKeyRange || range.type === 3)) {
      return this._write((trans) => {
        const { primaryKey } = ctx.table.core.schema;
        const coreRange = range;
        return ctx.table.core.count({ trans, query: { index: primaryKey, range: coreRange } }).then((count) => {
          return ctx.table.core.mutate({ trans, type: "deleteRange", range: coreRange }).then(({ failures, lastResult, results, numFailures }) => {
            if (numFailures)
              throw new ModifyError("Could not delete some values", Object.keys(failures).map((pos) => failures[pos]), count - numFailures);
            return count - numFailures;
          });
        });
      });
    }
    return this.modify(deleteCallback);
  }
};
var deleteCallback = (value, ctx) => ctx.value = null;
function createCollectionConstructor(db) {
  return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
    this.db = db;
    let keyRange = AnyRange, error = null;
    if (keyRangeGenerator)
      try {
        keyRange = keyRangeGenerator();
      } catch (ex) {
        error = ex;
      }
    const whereCtx = whereClause._ctx;
    const table = whereCtx.table;
    const readingHook = table.hook.reading.fire;
    this._ctx = {
      table,
      index: whereCtx.index,
      isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
      range: keyRange,
      keysOnly: false,
      dir: "next",
      unique: "",
      algorithm: null,
      filter: null,
      replayFilter: null,
      justLimit: true,
      isMatch: null,
      offset: 0,
      limit: Infinity,
      error,
      or: whereCtx.or,
      valueMapper: readingHook !== mirror ? readingHook : null
    };
  });
}
function simpleCompare(a, b2) {
  return a < b2 ? -1 : a === b2 ? 0 : 1;
}
function simpleCompareReverse(a, b2) {
  return a > b2 ? -1 : a === b2 ? 0 : 1;
}
function fail(collectionOrWhereClause, err, T) {
  var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
  collection._ctx.error = T ? new T(err) : new TypeError(err);
  return collection;
}
function emptyCollection(whereClause) {
  return new whereClause.Collection(whereClause, () => rangeEqual("")).limit(0);
}
function upperFactory(dir) {
  return dir === "next" ? (s) => s.toUpperCase() : (s) => s.toLowerCase();
}
function lowerFactory(dir) {
  return dir === "next" ? (s) => s.toLowerCase() : (s) => s.toUpperCase();
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp2, dir) {
  var length = Math.min(key.length, lowerNeedle.length);
  var llp = -1;
  for (var i = 0; i < length; ++i) {
    var lwrKeyChar = lowerKey[i];
    if (lwrKeyChar !== lowerNeedle[i]) {
      if (cmp2(key[i], upperNeedle[i]) < 0)
        return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
      if (cmp2(key[i], lowerNeedle[i]) < 0)
        return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
      if (llp >= 0)
        return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
      return null;
    }
    if (cmp2(key[i], lwrKeyChar) < 0)
      llp = i;
  }
  if (length < lowerNeedle.length && dir === "next")
    return key + upperNeedle.substr(key.length);
  if (length < key.length && dir === "prev")
    return key.substr(0, upperNeedle.length);
  return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
  var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
  if (!needles.every((s) => typeof s === "string")) {
    return fail(whereClause, STRING_EXPECTED);
  }
  function initDirection(dir) {
    upper = upperFactory(dir);
    lower = lowerFactory(dir);
    compare = dir === "next" ? simpleCompare : simpleCompareReverse;
    var needleBounds = needles.map(function(needle) {
      return { lower: lower(needle), upper: upper(needle) };
    }).sort(function(a, b2) {
      return compare(a.lower, b2.lower);
    });
    upperNeedles = needleBounds.map(function(nb) {
      return nb.upper;
    });
    lowerNeedles = needleBounds.map(function(nb) {
      return nb.lower;
    });
    direction = dir;
    nextKeySuffix = dir === "next" ? "" : suffix;
  }
  initDirection("next");
  var c = new whereClause.Collection(whereClause, () => createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix));
  c._ondirectionchange = function(direction2) {
    initDirection(direction2);
  };
  var firstPossibleNeedle = 0;
  c._addAlgorithm(function(cursor, advance, resolve) {
    var key = cursor.key;
    if (typeof key !== "string")
      return false;
    var lowerKey = lower(key);
    if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
      return true;
    } else {
      var lowestPossibleCasing = null;
      for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
        var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
        if (casing === null && lowestPossibleCasing === null)
          firstPossibleNeedle = i + 1;
        else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
          lowestPossibleCasing = casing;
        }
      }
      if (lowestPossibleCasing !== null) {
        advance(function() {
          cursor.continue(lowestPossibleCasing + nextKeySuffix);
        });
      } else {
        advance(resolve);
      }
      return false;
    }
  });
  return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
  return {
    type: 2,
    lower,
    upper,
    lowerOpen,
    upperOpen
  };
}
function rangeEqual(value) {
  return {
    type: 1,
    lower: value,
    upper: value
  };
}
var WhereClause = class {
  get Collection() {
    return this._ctx.table.db.Collection;
  }
  between(lower, upper, includeLower, includeUpper) {
    includeLower = includeLower !== false;
    includeUpper = includeUpper === true;
    try {
      if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper))
        return emptyCollection(this);
      return new this.Collection(this, () => createRange(lower, upper, !includeLower, !includeUpper));
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
  }
  equals(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => rangeEqual(value));
  }
  above(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(value, void 0, true));
  }
  aboveOrEqual(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(value, void 0, false));
  }
  below(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(void 0, value, false, true));
  }
  belowOrEqual(value) {
    if (value == null)
      return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(void 0, value));
  }
  startsWith(str) {
    if (typeof str !== "string")
      return fail(this, STRING_EXPECTED);
    return this.between(str, str + maxString, true, true);
  }
  startsWithIgnoreCase(str) {
    if (str === "")
      return this.startsWith(str);
    return addIgnoreCaseAlgorithm(this, (x, a) => x.indexOf(a[0]) === 0, [str], maxString);
  }
  equalsIgnoreCase(str) {
    return addIgnoreCaseAlgorithm(this, (x, a) => x === a[0], [str], "");
  }
  anyOfIgnoreCase() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, (x, a) => a.indexOf(x) !== -1, set, "");
  }
  startsWithAnyOfIgnoreCase() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, (x, a) => a.some((n) => x.indexOf(n) === 0), set, maxString);
  }
  anyOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    let compare = this._cmp;
    try {
      set.sort(compare);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    if (set.length === 0)
      return emptyCollection(this);
    const c = new this.Collection(this, () => createRange(set[0], set[set.length - 1]));
    c._ondirectionchange = (direction) => {
      compare = direction === "next" ? this._ascending : this._descending;
      set.sort(compare);
    };
    let i = 0;
    c._addAlgorithm((cursor, advance, resolve) => {
      const key = cursor.key;
      while (compare(key, set[i]) > 0) {
        ++i;
        if (i === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (compare(key, set[i]) === 0) {
        return true;
      } else {
        advance(() => {
          cursor.continue(set[i]);
        });
        return false;
      }
    });
    return c;
  }
  notEqual(value) {
    return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], { includeLowers: false, includeUppers: false });
  }
  noneOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0)
      return new this.Collection(this);
    try {
      set.sort(this._ascending);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    const ranges = set.reduce((res, val) => res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]], null);
    ranges.push([set[set.length - 1], this.db._maxKey]);
    return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
  }
  inAnyRange(ranges, options) {
    const cmp2 = this._cmp, ascending = this._ascending, descending = this._descending, min = this._min, max = this._max;
    if (ranges.length === 0)
      return emptyCollection(this);
    if (!ranges.every((range) => range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0)) {
      return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
    }
    const includeLowers = !options || options.includeLowers !== false;
    const includeUppers = options && options.includeUppers === true;
    function addRange2(ranges2, newRange) {
      let i = 0, l = ranges2.length;
      for (; i < l; ++i) {
        const range = ranges2[i];
        if (cmp2(newRange[0], range[1]) < 0 && cmp2(newRange[1], range[0]) > 0) {
          range[0] = min(range[0], newRange[0]);
          range[1] = max(range[1], newRange[1]);
          break;
        }
      }
      if (i === l)
        ranges2.push(newRange);
      return ranges2;
    }
    let sortDirection = ascending;
    function rangeSorter(a, b2) {
      return sortDirection(a[0], b2[0]);
    }
    let set;
    try {
      set = ranges.reduce(addRange2, []);
      set.sort(rangeSorter);
    } catch (ex) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    let rangePos = 0;
    const keyIsBeyondCurrentEntry = includeUppers ? (key) => ascending(key, set[rangePos][1]) > 0 : (key) => ascending(key, set[rangePos][1]) >= 0;
    const keyIsBeforeCurrentEntry = includeLowers ? (key) => descending(key, set[rangePos][0]) > 0 : (key) => descending(key, set[rangePos][0]) >= 0;
    function keyWithinCurrentRange(key) {
      return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
    }
    let checkKey = keyIsBeyondCurrentEntry;
    const c = new this.Collection(this, () => createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers));
    c._ondirectionchange = (direction) => {
      if (direction === "next") {
        checkKey = keyIsBeyondCurrentEntry;
        sortDirection = ascending;
      } else {
        checkKey = keyIsBeforeCurrentEntry;
        sortDirection = descending;
      }
      set.sort(rangeSorter);
    };
    c._addAlgorithm((cursor, advance, resolve) => {
      var key = cursor.key;
      while (checkKey(key)) {
        ++rangePos;
        if (rangePos === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (keyWithinCurrentRange(key)) {
        return true;
      } else if (this._cmp(key, set[rangePos][1]) === 0 || this._cmp(key, set[rangePos][0]) === 0) {
        return false;
      } else {
        advance(() => {
          if (sortDirection === ascending)
            cursor.continue(set[rangePos][0]);
          else
            cursor.continue(set[rangePos][1]);
        });
        return false;
      }
    });
    return c;
  }
  startsWithAnyOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (!set.every((s) => typeof s === "string")) {
      return fail(this, "startsWithAnyOf() only works with strings");
    }
    if (set.length === 0)
      return emptyCollection(this);
    return this.inAnyRange(set.map((str) => [str, str + maxString]));
  }
};
function createWhereClauseConstructor(db) {
  return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
    this.db = db;
    this._ctx = {
      table,
      index: index === ":id" ? null : index,
      or: orCollection
    };
    const indexedDB2 = db._deps.indexedDB;
    if (!indexedDB2)
      throw new exceptions.MissingAPI();
    this._cmp = this._ascending = indexedDB2.cmp.bind(indexedDB2);
    this._descending = (a, b2) => indexedDB2.cmp(b2, a);
    this._max = (a, b2) => indexedDB2.cmp(a, b2) > 0 ? a : b2;
    this._min = (a, b2) => indexedDB2.cmp(a, b2) < 0 ? a : b2;
    this._IDBKeyRange = db._deps.IDBKeyRange;
  });
}
function eventRejectHandler(reject) {
  return wrap2(function(event) {
    preventDefault(event);
    reject(event.target.error);
    return false;
  });
}
function preventDefault(event) {
  if (event.stopPropagation)
    event.stopPropagation();
  if (event.preventDefault)
    event.preventDefault();
}
var DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
var STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);
var Transaction = class {
  _lock() {
    assert(!PSD.global);
    ++this._reculock;
    if (this._reculock === 1 && !PSD.global)
      PSD.lockOwnerFor = this;
    return this;
  }
  _unlock() {
    assert(!PSD.global);
    if (--this._reculock === 0) {
      if (!PSD.global)
        PSD.lockOwnerFor = null;
      while (this._blockedFuncs.length > 0 && !this._locked()) {
        var fnAndPSD = this._blockedFuncs.shift();
        try {
          usePSD(fnAndPSD[1], fnAndPSD[0]);
        } catch (e) {
        }
      }
    }
    return this;
  }
  _locked() {
    return this._reculock && PSD.lockOwnerFor !== this;
  }
  create(idbtrans) {
    if (!this.mode)
      return this;
    const idbdb = this.db.idbdb;
    const dbOpenError = this.db._state.dbOpenError;
    assert(!this.idbtrans);
    if (!idbtrans && !idbdb) {
      switch (dbOpenError && dbOpenError.name) {
        case "DatabaseClosedError":
          throw new exceptions.DatabaseClosed(dbOpenError);
        case "MissingAPIError":
          throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
        default:
          throw new exceptions.OpenFailed(dbOpenError);
      }
    }
    if (!this.active)
      throw new exceptions.TransactionInactive();
    assert(this._completion._state === null);
    idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }) : idbdb.transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability }));
    idbtrans.onerror = wrap2((ev) => {
      preventDefault(ev);
      this._reject(idbtrans.error);
    });
    idbtrans.onabort = wrap2((ev) => {
      preventDefault(ev);
      this.active && this._reject(new exceptions.Abort(idbtrans.error));
      this.active = false;
      this.on("abort").fire(ev);
    });
    idbtrans.oncomplete = wrap2(() => {
      this.active = false;
      this._resolve();
      if ("mutatedParts" in idbtrans) {
        globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
      }
    });
    return this;
  }
  _promise(mode, fn, bWriteLock) {
    if (mode === "readwrite" && this.mode !== "readwrite")
      return rejection(new exceptions.ReadOnly("Transaction is readonly"));
    if (!this.active)
      return rejection(new exceptions.TransactionInactive());
    if (this._locked()) {
      return new DexiePromise((resolve, reject) => {
        this._blockedFuncs.push([() => {
          this._promise(mode, fn, bWriteLock).then(resolve, reject);
        }, PSD]);
      });
    } else if (bWriteLock) {
      return newScope(() => {
        var p2 = new DexiePromise((resolve, reject) => {
          this._lock();
          const rv = fn(resolve, reject, this);
          if (rv && rv.then)
            rv.then(resolve, reject);
        });
        p2.finally(() => this._unlock());
        p2._lib = true;
        return p2;
      });
    } else {
      var p = new DexiePromise((resolve, reject) => {
        var rv = fn(resolve, reject, this);
        if (rv && rv.then)
          rv.then(resolve, reject);
      });
      p._lib = true;
      return p;
    }
  }
  _root() {
    return this.parent ? this.parent._root() : this;
  }
  waitFor(promiseLike) {
    var root = this._root();
    const promise = DexiePromise.resolve(promiseLike);
    if (root._waitingFor) {
      root._waitingFor = root._waitingFor.then(() => promise);
    } else {
      root._waitingFor = promise;
      root._waitingQueue = [];
      var store = root.idbtrans.objectStore(root.storeNames[0]);
      (function spin() {
        ++root._spinCount;
        while (root._waitingQueue.length)
          root._waitingQueue.shift()();
        if (root._waitingFor)
          store.get(-Infinity).onsuccess = spin;
      })();
    }
    var currentWaitPromise = root._waitingFor;
    return new DexiePromise((resolve, reject) => {
      promise.then((res) => root._waitingQueue.push(wrap2(resolve.bind(null, res))), (err) => root._waitingQueue.push(wrap2(reject.bind(null, err)))).finally(() => {
        if (root._waitingFor === currentWaitPromise) {
          root._waitingFor = null;
        }
      });
    });
  }
  abort() {
    if (this.active) {
      this.active = false;
      if (this.idbtrans)
        this.idbtrans.abort();
      this._reject(new exceptions.Abort());
    }
  }
  table(tableName) {
    const memoizedTables = this._memoizedTables || (this._memoizedTables = {});
    if (hasOwn(memoizedTables, tableName))
      return memoizedTables[tableName];
    const tableSchema = this.schema[tableName];
    if (!tableSchema) {
      throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
    }
    const transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
    transactionBoundTable.core = this.db.core.table(tableName);
    memoizedTables[tableName] = transactionBoundTable;
    return transactionBoundTable;
  }
};
function createTransactionConstructor(db) {
  return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
    this.db = db;
    this.mode = mode;
    this.storeNames = storeNames;
    this.schema = dbschema;
    this.chromeTransactionDurability = chromeTransactionDurability;
    this.idbtrans = null;
    this.on = Events(this, "complete", "error", "abort");
    this.parent = parent || null;
    this.active = true;
    this._reculock = 0;
    this._blockedFuncs = [];
    this._resolve = null;
    this._reject = null;
    this._waitingFor = null;
    this._waitingQueue = null;
    this._spinCount = 0;
    this._completion = new DexiePromise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this._completion.then(() => {
      this.active = false;
      this.on.complete.fire();
    }, (e) => {
      var wasActive = this.active;
      this.active = false;
      this.on.error.fire(e);
      this.parent ? this.parent._reject(e) : wasActive && this.idbtrans && this.idbtrans.abort();
      return rejection(e);
    });
  });
}
function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
  return {
    name,
    keyPath,
    unique,
    multi,
    auto,
    compound,
    src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
  };
}
function nameFromKeyPath(keyPath) {
  return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
}
function createTableSchema(name, primKey, indexes) {
  return {
    name,
    primKey,
    indexes,
    mappedClass: null,
    idxByName: arrayToObject(indexes, (index) => [index.name, index])
  };
}
function safariMultiStoreFix(storeNames) {
  return storeNames.length === 1 ? storeNames[0] : storeNames;
}
var getMaxKey = (IdbKeyRange) => {
  try {
    IdbKeyRange.only([[]]);
    getMaxKey = () => [[]];
    return [[]];
  } catch (e) {
    getMaxKey = () => maxString;
    return maxString;
  }
};
function getKeyExtractor(keyPath) {
  if (keyPath == null) {
    return () => void 0;
  } else if (typeof keyPath === "string") {
    return getSinglePathKeyExtractor(keyPath);
  } else {
    return (obj) => getByKeyPath(obj, keyPath);
  }
}
function getSinglePathKeyExtractor(keyPath) {
  const split = keyPath.split(".");
  if (split.length === 1) {
    return (obj) => obj[keyPath];
  } else {
    return (obj) => getByKeyPath(obj, keyPath);
  }
}
function arrayify(arrayLike) {
  return [].slice.call(arrayLike);
}
var _id_counter = 0;
function getKeyPathAlias(keyPath) {
  return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : `[${keyPath.join("+")}]`;
}
function createDBCore(db, IdbKeyRange, tmpTrans) {
  function extractSchema(db2, trans) {
    const tables2 = arrayify(db2.objectStoreNames);
    return {
      schema: {
        name: db2.name,
        tables: tables2.map((table) => trans.objectStore(table)).map((store) => {
          const { keyPath, autoIncrement } = store;
          const compound = isArray(keyPath);
          const outbound = keyPath == null;
          const indexByKeyPath = {};
          const result = {
            name: store.name,
            primaryKey: {
              name: null,
              isPrimaryKey: true,
              outbound,
              compound,
              keyPath,
              autoIncrement,
              unique: true,
              extractKey: getKeyExtractor(keyPath)
            },
            indexes: arrayify(store.indexNames).map((indexName) => store.index(indexName)).map((index) => {
              const { name, unique, multiEntry, keyPath: keyPath2 } = index;
              const compound2 = isArray(keyPath2);
              const result2 = {
                name,
                compound: compound2,
                keyPath: keyPath2,
                unique,
                multiEntry,
                extractKey: getKeyExtractor(keyPath2)
              };
              indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
              return result2;
            }),
            getIndexByKeyPath: (keyPath2) => indexByKeyPath[getKeyPathAlias(keyPath2)]
          };
          indexByKeyPath[":id"] = result.primaryKey;
          if (keyPath != null) {
            indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
          }
          return result;
        })
      },
      hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
    };
  }
  function makeIDBKeyRange(range) {
    if (range.type === 3)
      return null;
    if (range.type === 4)
      throw new Error("Cannot convert never type to IDBKeyRange");
    const { lower, upper, lowerOpen, upperOpen } = range;
    const idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
    return idbRange;
  }
  function createDbCoreTable(tableSchema) {
    const tableName = tableSchema.name;
    function mutate({ trans, type: type2, keys: keys2, values, range }) {
      return new Promise((resolve, reject) => {
        resolve = wrap2(resolve);
        const store = trans.objectStore(tableName);
        const outbound = store.keyPath == null;
        const isAddOrPut = type2 === "put" || type2 === "add";
        if (!isAddOrPut && type2 !== "delete" && type2 !== "deleteRange")
          throw new Error("Invalid operation type: " + type2);
        const { length } = keys2 || values || { length: 1 };
        if (keys2 && values && keys2.length !== values.length) {
          throw new Error("Given keys array must have same length as given values array.");
        }
        if (length === 0)
          return resolve({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
        let req;
        const reqs = [];
        const failures = [];
        let numFailures = 0;
        const errorHandler = (event) => {
          ++numFailures;
          preventDefault(event);
        };
        if (type2 === "deleteRange") {
          if (range.type === 4)
            return resolve({ numFailures, failures, results: [], lastResult: void 0 });
          if (range.type === 3)
            reqs.push(req = store.clear());
          else
            reqs.push(req = store.delete(makeIDBKeyRange(range)));
        } else {
          const [args1, args2] = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null];
          if (isAddOrPut) {
            for (let i = 0; i < length; ++i) {
              reqs.push(req = args2 && args2[i] !== void 0 ? store[type2](args1[i], args2[i]) : store[type2](args1[i]));
              req.onerror = errorHandler;
            }
          } else {
            for (let i = 0; i < length; ++i) {
              reqs.push(req = store[type2](args1[i]));
              req.onerror = errorHandler;
            }
          }
        }
        const done = (event) => {
          const lastResult = event.target.result;
          reqs.forEach((req2, i) => req2.error != null && (failures[i] = req2.error));
          resolve({
            numFailures,
            failures,
            results: type2 === "delete" ? keys2 : reqs.map((req2) => req2.result),
            lastResult
          });
        };
        req.onerror = (event) => {
          errorHandler(event);
          done(event);
        };
        req.onsuccess = done;
      });
    }
    function openCursor2({ trans, values, query: query2, reverse, unique }) {
      return new Promise((resolve, reject) => {
        resolve = wrap2(resolve);
        const { index, range } = query2;
        const store = trans.objectStore(tableName);
        const source = index.isPrimaryKey ? store : store.index(index.name);
        const direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
        const req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
        req.onerror = eventRejectHandler(reject);
        req.onsuccess = wrap2((ev) => {
          const cursor = req.result;
          if (!cursor) {
            resolve(null);
            return;
          }
          cursor.___id = ++_id_counter;
          cursor.done = false;
          const _cursorContinue = cursor.continue.bind(cursor);
          let _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
          if (_cursorContinuePrimaryKey)
            _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
          const _cursorAdvance = cursor.advance.bind(cursor);
          const doThrowCursorIsNotStarted = () => {
            throw new Error("Cursor not started");
          };
          const doThrowCursorIsStopped = () => {
            throw new Error("Cursor not stopped");
          };
          cursor.trans = trans;
          cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
          cursor.fail = wrap2(reject);
          cursor.next = function() {
            let gotOne = 1;
            return this.start(() => gotOne-- ? this.continue() : this.stop()).then(() => this);
          };
          cursor.start = (callback) => {
            const iterationPromise = new Promise((resolveIteration, rejectIteration) => {
              resolveIteration = wrap2(resolveIteration);
              req.onerror = eventRejectHandler(rejectIteration);
              cursor.fail = rejectIteration;
              cursor.stop = (value) => {
                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                resolveIteration(value);
              };
            });
            const guardedCallback = () => {
              if (req.result) {
                try {
                  callback();
                } catch (err) {
                  cursor.fail(err);
                }
              } else {
                cursor.done = true;
                cursor.start = () => {
                  throw new Error("Cursor behind last entry");
                };
                cursor.stop();
              }
            };
            req.onsuccess = wrap2((ev2) => {
              req.onsuccess = guardedCallback;
              guardedCallback();
            });
            cursor.continue = _cursorContinue;
            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
            cursor.advance = _cursorAdvance;
            guardedCallback();
            return iterationPromise;
          };
          resolve(cursor);
        }, reject);
      });
    }
    function query(hasGetAll2) {
      return (request) => {
        return new Promise((resolve, reject) => {
          resolve = wrap2(resolve);
          const { trans, values, limit, query: query2 } = request;
          const nonInfinitLimit = limit === Infinity ? void 0 : limit;
          const { index, range } = query2;
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const idbKeyRange = makeIDBKeyRange(range);
          if (limit === 0)
            return resolve({ result: [] });
          if (hasGetAll2) {
            const req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
            req.onsuccess = (event) => resolve({ result: event.target.result });
            req.onerror = eventRejectHandler(reject);
          } else {
            let count = 0;
            const req = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
            const result = [];
            req.onsuccess = (event) => {
              const cursor = req.result;
              if (!cursor)
                return resolve({ result });
              result.push(values ? cursor.value : cursor.primaryKey);
              if (++count === limit)
                return resolve({ result });
              cursor.continue();
            };
            req.onerror = eventRejectHandler(reject);
          }
        });
      };
    }
    return {
      name: tableName,
      schema: tableSchema,
      mutate,
      getMany({ trans, keys: keys2 }) {
        return new Promise((resolve, reject) => {
          resolve = wrap2(resolve);
          const store = trans.objectStore(tableName);
          const length = keys2.length;
          const result = new Array(length);
          let keyCount = 0;
          let callbackCount = 0;
          let req;
          const successHandler = (event) => {
            const req2 = event.target;
            if ((result[req2._pos] = req2.result) != null)
              ;
            if (++callbackCount === keyCount)
              resolve(result);
          };
          const errorHandler = eventRejectHandler(reject);
          for (let i = 0; i < length; ++i) {
            const key = keys2[i];
            if (key != null) {
              req = store.get(keys2[i]);
              req._pos = i;
              req.onsuccess = successHandler;
              req.onerror = errorHandler;
              ++keyCount;
            }
          }
          if (keyCount === 0)
            resolve(result);
        });
      },
      get({ trans, key }) {
        return new Promise((resolve, reject) => {
          resolve = wrap2(resolve);
          const store = trans.objectStore(tableName);
          const req = store.get(key);
          req.onsuccess = (event) => resolve(event.target.result);
          req.onerror = eventRejectHandler(reject);
        });
      },
      query: query(hasGetAll),
      openCursor: openCursor2,
      count({ query: query2, trans }) {
        const { index, range } = query2;
        return new Promise((resolve, reject) => {
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const idbKeyRange = makeIDBKeyRange(range);
          const req = idbKeyRange ? source.count(idbKeyRange) : source.count();
          req.onsuccess = wrap2((ev) => resolve(ev.target.result));
          req.onerror = eventRejectHandler(reject);
        });
      }
    };
  }
  const { schema, hasGetAll } = extractSchema(db, tmpTrans);
  const tables = schema.tables.map((tableSchema) => createDbCoreTable(tableSchema));
  const tableMap = {};
  tables.forEach((table) => tableMap[table.name] = table);
  return {
    stack: "dbcore",
    transaction: db.transaction.bind(db),
    table(name) {
      const result = tableMap[name];
      if (!result)
        throw new Error(`Table '${name}' not found`);
      return tableMap[name];
    },
    MIN_KEY: -Infinity,
    MAX_KEY: getMaxKey(IdbKeyRange),
    schema
  };
}
function createMiddlewareStack(stackImpl, middlewares) {
  return middlewares.reduce((down, { create }) => ({ ...down, ...create(down) }), stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, { IDBKeyRange: IDBKeyRange2, indexedDB: indexedDB2 }, tmpTrans) {
  const dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange2, tmpTrans), middlewares.dbcore);
  return {
    dbcore
  };
}
function generateMiddlewareStacks({ _novip: db }, tmpTrans) {
  const idbdb = tmpTrans.db;
  const stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
  db.core = stacks.dbcore;
  db.tables.forEach((table) => {
    const tableName = table.name;
    if (db.core.schema.tables.some((tbl) => tbl.name === tableName)) {
      table.core = db.core.table(tableName);
      if (db[tableName] instanceof db.Table) {
        db[tableName].core = table.core;
      }
    }
  });
}
function setApiOnPlace({ _novip: db }, objs, tableNames, dbschema) {
  tableNames.forEach((tableName) => {
    const schema = dbschema[tableName];
    objs.forEach((obj) => {
      const propDesc = getPropertyDescriptor(obj, tableName);
      if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
        if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
          setProp(obj, tableName, {
            get() {
              return this.table(tableName);
            },
            set(value) {
              defineProperty(this, tableName, { value, writable: true, configurable: true, enumerable: true });
            }
          });
        } else {
          obj[tableName] = new db.Table(tableName, schema);
        }
      }
    });
  });
}
function removeTablesApi({ _novip: db }, objs) {
  objs.forEach((obj) => {
    for (let key in obj) {
      if (obj[key] instanceof db.Table)
        delete obj[key];
    }
  });
}
function lowerVersionFirst(a, b2) {
  return a._cfg.version - b2._cfg.version;
}
function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
  const globalSchema = db._dbSchema;
  const trans = db._createTransaction("readwrite", db._storeNames, globalSchema);
  trans.create(idbUpgradeTrans);
  trans._completion.catch(reject);
  const rejectTransaction = trans._reject.bind(trans);
  const transless = PSD.transless || PSD;
  newScope(() => {
    PSD.trans = trans;
    PSD.transless = transless;
    if (oldVersion === 0) {
      keys(globalSchema).forEach((tableName) => {
        createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
      });
      generateMiddlewareStacks(db, idbUpgradeTrans);
      DexiePromise.follow(() => db.on.populate.fire(trans)).catch(rejectTransaction);
    } else
      updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
  });
}
function updateTablesAndIndexes({ _novip: db }, oldVersion, trans, idbUpgradeTrans) {
  const queue = [];
  const versions = db._versions;
  let globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
  let anyContentUpgraderHasRun = false;
  const versToRun = versions.filter((v) => v._cfg.version >= oldVersion);
  versToRun.forEach((version) => {
    queue.push(() => {
      const oldSchema = globalSchema;
      const newSchema = version._cfg.dbschema;
      adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
      adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
      globalSchema = db._dbSchema = newSchema;
      const diff = getSchemaDiff(oldSchema, newSchema);
      diff.add.forEach((tuple) => {
        createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
      });
      diff.change.forEach((change) => {
        if (change.recreate) {
          throw new exceptions.Upgrade("Not yet support for changing primary key");
        } else {
          const store = idbUpgradeTrans.objectStore(change.name);
          change.add.forEach((idx) => addIndex(store, idx));
          change.change.forEach((idx) => {
            store.deleteIndex(idx.name);
            addIndex(store, idx);
          });
          change.del.forEach((idxName) => store.deleteIndex(idxName));
        }
      });
      const contentUpgrade = version._cfg.contentUpgrade;
      if (contentUpgrade && version._cfg.version > oldVersion) {
        generateMiddlewareStacks(db, idbUpgradeTrans);
        trans._memoizedTables = {};
        anyContentUpgraderHasRun = true;
        let upgradeSchema = shallowClone(newSchema);
        diff.del.forEach((table) => {
          upgradeSchema[table] = oldSchema[table];
        });
        removeTablesApi(db, [db.Transaction.prototype]);
        setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema), upgradeSchema);
        trans.schema = upgradeSchema;
        const contentUpgradeIsAsync = isAsyncFunction(contentUpgrade);
        if (contentUpgradeIsAsync) {
          incrementExpectedAwaits();
        }
        let returnValue;
        const promiseFollowed = DexiePromise.follow(() => {
          returnValue = contentUpgrade(trans);
          if (returnValue) {
            if (contentUpgradeIsAsync) {
              var decrementor = decrementExpectedAwaits.bind(null, null);
              returnValue.then(decrementor, decrementor);
            }
          }
        });
        return returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue) : promiseFollowed.then(() => returnValue);
      }
    });
    queue.push((idbtrans) => {
      if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
        const newSchema = version._cfg.dbschema;
        deleteRemovedTables(newSchema, idbtrans);
      }
      removeTablesApi(db, [db.Transaction.prototype]);
      setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
      trans.schema = db._dbSchema;
    });
  });
  function runQueue() {
    return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
  }
  return runQueue().then(() => {
    createMissingTables(globalSchema, idbUpgradeTrans);
  });
}
function getSchemaDiff(oldSchema, newSchema) {
  const diff = {
    del: [],
    add: [],
    change: []
  };
  let table;
  for (table in oldSchema) {
    if (!newSchema[table])
      diff.del.push(table);
  }
  for (table in newSchema) {
    const oldDef = oldSchema[table], newDef = newSchema[table];
    if (!oldDef) {
      diff.add.push([table, newDef]);
    } else {
      const change = {
        name: table,
        def: newDef,
        recreate: false,
        del: [],
        add: [],
        change: []
      };
      if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge) {
        change.recreate = true;
        diff.change.push(change);
      } else {
        const oldIndexes = oldDef.idxByName;
        const newIndexes = newDef.idxByName;
        let idxName;
        for (idxName in oldIndexes) {
          if (!newIndexes[idxName])
            change.del.push(idxName);
        }
        for (idxName in newIndexes) {
          const oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
          if (!oldIdx)
            change.add.push(newIdx);
          else if (oldIdx.src !== newIdx.src)
            change.change.push(newIdx);
        }
        if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
          diff.change.push(change);
        }
      }
    }
  }
  return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
  const store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
  indexes.forEach((idx) => addIndex(store, idx));
  return store;
}
function createMissingTables(newSchema, idbtrans) {
  keys(newSchema).forEach((tableName) => {
    if (!idbtrans.db.objectStoreNames.contains(tableName)) {
      createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
    }
  });
}
function deleteRemovedTables(newSchema, idbtrans) {
  [].slice.call(idbtrans.db.objectStoreNames).forEach((storeName) => newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName));
}
function addIndex(store, idx) {
  store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
}
function buildGlobalSchema(db, idbdb, tmpTrans) {
  const globalSchema = {};
  const dbStoreNames = slice(idbdb.objectStoreNames, 0);
  dbStoreNames.forEach((storeName) => {
    const store = tmpTrans.objectStore(storeName);
    let keyPath = store.keyPath;
    const primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
    const indexes = [];
    for (let j = 0; j < store.indexNames.length; ++j) {
      const idbindex = store.index(store.indexNames[j]);
      keyPath = idbindex.keyPath;
      var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
      indexes.push(index);
    }
    globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
  });
  return globalSchema;
}
function readGlobalSchema({ _novip: db }, idbdb, tmpTrans) {
  db.verno = idbdb.version / 10;
  const globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
  db._storeNames = slice(idbdb.objectStoreNames, 0);
  setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
}
function verifyInstalledSchema(db, tmpTrans) {
  const installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
  const diff = getSchemaDiff(installedSchema, db._dbSchema);
  return !(diff.add.length || diff.change.some((ch) => ch.add.length || ch.change.length));
}
function adjustToExistingIndexNames({ _novip: db }, schema, idbtrans) {
  const storeNames = idbtrans.db.objectStoreNames;
  for (let i = 0; i < storeNames.length; ++i) {
    const storeName = storeNames[i];
    const store = idbtrans.objectStore(storeName);
    db._hasGetAll = "getAll" in store;
    for (let j = 0; j < store.indexNames.length; ++j) {
      const indexName = store.indexNames[j];
      const keyPath = store.index(indexName).keyPath;
      const dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
      if (schema[storeName]) {
        const indexSpec = schema[storeName].idxByName[dexieName];
        if (indexSpec) {
          indexSpec.name = indexName;
          delete schema[storeName].idxByName[dexieName];
          schema[storeName].idxByName[indexName] = indexSpec;
        }
      }
    }
  }
  if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
    db._hasGetAll = false;
  }
}
function parseIndexSyntax(primKeyAndIndexes) {
  return primKeyAndIndexes.split(",").map((index, indexNum) => {
    index = index.trim();
    const name = index.replace(/([&*]|\+\+)/g, "");
    const keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
    return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
  });
}
var Version = class {
  _parseStoresSpec(stores, outSchema) {
    keys(stores).forEach((tableName) => {
      if (stores[tableName] !== null) {
        var indexes = parseIndexSyntax(stores[tableName]);
        var primKey = indexes.shift();
        if (primKey.multi)
          throw new exceptions.Schema("Primary key cannot be multi-valued");
        indexes.forEach((idx) => {
          if (idx.auto)
            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
          if (!idx.keyPath)
            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
        });
        outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
      }
    });
  }
  stores(stores) {
    const db = this.db;
    this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
    const versions = db._versions;
    const storesSpec = {};
    let dbschema = {};
    versions.forEach((version) => {
      extend(storesSpec, version._cfg.storesSource);
      dbschema = version._cfg.dbschema = {};
      version._parseStoresSpec(storesSpec, dbschema);
    });
    db._dbSchema = dbschema;
    removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
    setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
    db._storeNames = keys(dbschema);
    return this;
  }
  upgrade(upgradeFunction) {
    this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
    return this;
  }
};
function createVersionConstructor(db) {
  return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
    this.db = db;
    this._cfg = {
      version: versionNumber,
      storesSource: null,
      dbschema: {},
      tables: {},
      contentUpgrade: null
    };
  });
}
function getDbNamesTable(indexedDB2, IDBKeyRange2) {
  let dbNamesDB = indexedDB2["_dbNamesDB"];
  if (!dbNamesDB) {
    dbNamesDB = indexedDB2["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
      addons: [],
      indexedDB: indexedDB2,
      IDBKeyRange: IDBKeyRange2
    });
    dbNamesDB.version(1).stores({ dbnames: "name" });
  }
  return dbNamesDB.table("dbnames");
}
function hasDatabasesNative(indexedDB2) {
  return indexedDB2 && typeof indexedDB2.databases === "function";
}
function getDatabaseNames({ indexedDB: indexedDB2, IDBKeyRange: IDBKeyRange2 }) {
  return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then((infos) => infos.map((info) => info.name).filter((name) => name !== DBNAMES_DB)) : getDbNamesTable(indexedDB2, IDBKeyRange2).toCollection().primaryKeys();
}
function _onDatabaseCreated({ indexedDB: indexedDB2, IDBKeyRange: IDBKeyRange2 }, name) {
  !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange2).put({ name }).catch(nop);
}
function _onDatabaseDeleted({ indexedDB: indexedDB2, IDBKeyRange: IDBKeyRange2 }, name) {
  !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange2).delete(name).catch(nop);
}
function vip(fn) {
  return newScope(function() {
    PSD.letThrough = true;
    return fn();
  });
}
function idbReady() {
  var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
  if (!isSafari || !indexedDB.databases)
    return Promise.resolve();
  var intervalId;
  return new Promise(function(resolve) {
    var tryIdb = function() {
      return indexedDB.databases().finally(resolve);
    };
    intervalId = setInterval(tryIdb, 100);
    tryIdb();
  }).finally(function() {
    return clearInterval(intervalId);
  });
}
function dexieOpen(db) {
  const state = db._state;
  const { indexedDB: indexedDB2 } = db._deps;
  if (state.isBeingOpened || db.idbdb)
    return state.dbReadyPromise.then(() => state.dbOpenError ? rejection(state.dbOpenError) : db);
  debug && (state.openCanceller._stackHolder = getErrorWithStack());
  state.isBeingOpened = true;
  state.dbOpenError = null;
  state.openComplete = false;
  const openCanceller = state.openCanceller;
  function throwIfCancelled() {
    if (state.openCanceller !== openCanceller)
      throw new exceptions.DatabaseClosed("db.open() was cancelled");
  }
  let resolveDbReady = state.dbReadyResolve, upgradeTransaction = null, wasCreated = false;
  return DexiePromise.race([openCanceller, (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(() => new DexiePromise((resolve, reject) => {
    throwIfCancelled();
    if (!indexedDB2)
      throw new exceptions.MissingAPI();
    const dbName = db.name;
    const req = state.autoSchema ? indexedDB2.open(dbName) : indexedDB2.open(dbName, Math.round(db.verno * 10));
    if (!req)
      throw new exceptions.MissingAPI();
    req.onerror = eventRejectHandler(reject);
    req.onblocked = wrap2(db._fireOnBlocked);
    req.onupgradeneeded = wrap2((e) => {
      upgradeTransaction = req.transaction;
      if (state.autoSchema && !db._options.allowEmptyDB) {
        req.onerror = preventDefault;
        upgradeTransaction.abort();
        req.result.close();
        const delreq = indexedDB2.deleteDatabase(dbName);
        delreq.onsuccess = delreq.onerror = wrap2(() => {
          reject(new exceptions.NoSuchDatabase(`Database ${dbName} doesnt exist`));
        });
      } else {
        upgradeTransaction.onerror = eventRejectHandler(reject);
        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
        wasCreated = oldVer < 1;
        db._novip.idbdb = req.result;
        runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
      }
    }, reject);
    req.onsuccess = wrap2(() => {
      upgradeTransaction = null;
      const idbdb = db._novip.idbdb = req.result;
      const objectStoreNames = slice(idbdb.objectStoreNames);
      if (objectStoreNames.length > 0)
        try {
          const tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
          if (state.autoSchema)
            readGlobalSchema(db, idbdb, tmpTrans);
          else {
            adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
            if (!verifyInstalledSchema(db, tmpTrans)) {
              console.warn(`Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.`);
            }
          }
          generateMiddlewareStacks(db, tmpTrans);
        } catch (e) {
        }
      connections.push(db);
      idbdb.onversionchange = wrap2((ev) => {
        state.vcFired = true;
        db.on("versionchange").fire(ev);
      });
      idbdb.onclose = wrap2((ev) => {
        db.on("close").fire(ev);
      });
      if (wasCreated)
        _onDatabaseCreated(db._deps, dbName);
      resolve();
    }, reject);
  }))]).then(() => {
    throwIfCancelled();
    state.onReadyBeingFired = [];
    return DexiePromise.resolve(vip(() => db.on.ready.fire(db.vip))).then(function fireRemainders() {
      if (state.onReadyBeingFired.length > 0) {
        let remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(() => remainders(db.vip))).then(fireRemainders);
      }
    });
  }).finally(() => {
    state.onReadyBeingFired = null;
    state.isBeingOpened = false;
  }).then(() => {
    return db;
  }).catch((err) => {
    state.dbOpenError = err;
    try {
      upgradeTransaction && upgradeTransaction.abort();
    } catch (_a) {
    }
    if (openCanceller === state.openCanceller) {
      db._close();
    }
    return rejection(err);
  }).finally(() => {
    state.openComplete = true;
    resolveDbReady();
  });
}
function awaitIterator(iterator) {
  var callNext = (result) => iterator.next(result), doThrow = (error) => iterator.throw(error), onSuccess = step(callNext), onError = step(doThrow);
  function step(getNext) {
    return (val) => {
      var next = getNext(val), value = next.value;
      return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
    };
  }
  return step(callNext)();
}
function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
  var i = arguments.length;
  if (i < 2)
    throw new exceptions.InvalidArgument("Too few arguments");
  var args = new Array(i - 1);
  while (--i)
    args[i - 1] = arguments[i];
  scopeFunc = args.pop();
  var tables = flatten(args);
  return [mode, tables, scopeFunc];
}
function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
  return DexiePromise.resolve().then(() => {
    const transless = PSD.transless || PSD;
    const trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
    const zoneProps = {
      trans,
      transless
    };
    if (parentTransaction) {
      trans.idbtrans = parentTransaction.idbtrans;
    } else {
      try {
        trans.create();
        db._state.PR1398_maxLoop = 3;
      } catch (ex) {
        if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
          console.warn("Dexie: Need to reopen db");
          db._close();
          return db.open().then(() => enterTransactionScope(db, mode, storeNames, null, scopeFunc));
        }
        return rejection(ex);
      }
    }
    const scopeFuncIsAsync = isAsyncFunction(scopeFunc);
    if (scopeFuncIsAsync) {
      incrementExpectedAwaits();
    }
    let returnValue;
    const promiseFollowed = DexiePromise.follow(() => {
      returnValue = scopeFunc.call(trans, trans);
      if (returnValue) {
        if (scopeFuncIsAsync) {
          var decrementor = decrementExpectedAwaits.bind(null, null);
          returnValue.then(decrementor, decrementor);
        } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
          returnValue = awaitIterator(returnValue);
        }
      }
    }, zoneProps);
    return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then((x) => trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"))) : promiseFollowed.then(() => returnValue)).then((x) => {
      if (parentTransaction)
        trans._resolve();
      return trans._completion.then(() => x);
    }).catch((e) => {
      trans._reject(e);
      return rejection(e);
    });
  });
}
function pad(a, value, count) {
  const result = isArray(a) ? a.slice() : [a];
  for (let i = 0; i < count; ++i)
    result.push(value);
  return result;
}
function createVirtualIndexMiddleware(down) {
  return {
    ...down,
    table(tableName) {
      const table = down.table(tableName);
      const { schema } = table;
      const indexLookup = {};
      const allVirtualIndexes = [];
      function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
        const keyPathAlias = getKeyPathAlias(keyPath);
        const indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
        const keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
        const isVirtual = keyTail > 0;
        const virtualIndex = {
          ...lowLevelIndex,
          isVirtual,
          keyTail,
          keyLength,
          extractKey: getKeyExtractor(keyPath),
          unique: !isVirtual && lowLevelIndex.unique
        };
        indexList.push(virtualIndex);
        if (!virtualIndex.isPrimaryKey) {
          allVirtualIndexes.push(virtualIndex);
        }
        if (keyLength > 1) {
          const virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
          addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
        }
        indexList.sort((a, b2) => a.keyTail - b2.keyTail);
        return virtualIndex;
      }
      const primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
      indexLookup[":id"] = [primaryKey];
      for (const index of schema.indexes) {
        addVirtualIndexes(index.keyPath, 0, index);
      }
      function findBestIndex(keyPath) {
        const result2 = indexLookup[getKeyPathAlias(keyPath)];
        return result2 && result2[0];
      }
      function translateRange(range, keyTail) {
        return {
          type: range.type === 1 ? 2 : range.type,
          lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
          lowerOpen: true,
          upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
          upperOpen: true
        };
      }
      function translateRequest(req) {
        const index = req.query.index;
        return index.isVirtual ? {
          ...req,
          query: {
            index,
            range: translateRange(req.query.range, index.keyTail)
          }
        } : req;
      }
      const result = {
        ...table,
        schema: {
          ...schema,
          primaryKey,
          indexes: allVirtualIndexes,
          getIndexByKeyPath: findBestIndex
        },
        count(req) {
          return table.count(translateRequest(req));
        },
        query(req) {
          return table.query(translateRequest(req));
        },
        openCursor(req) {
          const { keyTail, isVirtual, keyLength } = req.query.index;
          if (!isVirtual)
            return table.openCursor(req);
          function createVirtualCursor(cursor) {
            function _continue(key) {
              key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
            }
            const virtualCursor = Object.create(cursor, {
              continue: { value: _continue },
              continuePrimaryKey: {
                value(key, primaryKey2) {
                  cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
                }
              },
              primaryKey: {
                get() {
                  return cursor.primaryKey;
                }
              },
              key: {
                get() {
                  const key = cursor.key;
                  return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                }
              },
              value: {
                get() {
                  return cursor.value;
                }
              }
            });
            return virtualCursor;
          }
          return table.openCursor(translateRequest(req)).then((cursor) => cursor && createVirtualCursor(cursor));
        }
      };
      return result;
    }
  };
}
var virtualIndexMiddleware = {
  stack: "dbcore",
  name: "VirtualIndexMiddleware",
  level: 1,
  create: createVirtualIndexMiddleware
};
function getObjectDiff(a, b2, rv, prfx) {
  rv = rv || {};
  prfx = prfx || "";
  keys(a).forEach((prop) => {
    if (!hasOwn(b2, prop)) {
      rv[prfx + prop] = void 0;
    } else {
      var ap = a[prop], bp = b2[prop];
      if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
        const apTypeName = toStringTag(ap);
        const bpTypeName = toStringTag(bp);
        if (apTypeName !== bpTypeName) {
          rv[prfx + prop] = b2[prop];
        } else if (apTypeName === "Object") {
          getObjectDiff(ap, bp, rv, prfx + prop + ".");
        } else if (ap !== bp) {
          rv[prfx + prop] = b2[prop];
        }
      } else if (ap !== bp)
        rv[prfx + prop] = b2[prop];
    }
  });
  keys(b2).forEach((prop) => {
    if (!hasOwn(a, prop)) {
      rv[prfx + prop] = b2[prop];
    }
  });
  return rv;
}
function getEffectiveKeys(primaryKey, req) {
  if (req.type === "delete")
    return req.keys;
  return req.keys || req.values.map(primaryKey.extractKey);
}
var hooksMiddleware = {
  stack: "dbcore",
  name: "HooksMiddleware",
  level: 2,
  create: (downCore) => ({
    ...downCore,
    table(tableName) {
      const downTable = downCore.table(tableName);
      const { primaryKey } = downTable.schema;
      const tableMiddleware = {
        ...downTable,
        mutate(req) {
          const dxTrans = PSD.trans;
          const { deleting, creating, updating } = dxTrans.table(tableName).hook;
          switch (req.type) {
            case "add":
              if (creating.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "put":
              if (creating.fire === nop && updating.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "delete":
              if (deleting.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "deleteRange":
              if (deleting.fire === nop)
                break;
              return dxTrans._promise("readwrite", () => deleteRange(req), true);
          }
          return downTable.mutate(req);
          function addPutOrDelete(req2) {
            const dxTrans2 = PSD.trans;
            const keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
            if (!keys2)
              throw new Error("Keys missing");
            req2 = req2.type === "add" || req2.type === "put" ? { ...req2, keys: keys2 } : { ...req2 };
            if (req2.type !== "delete")
              req2.values = [...req2.values];
            if (req2.keys)
              req2.keys = [...req2.keys];
            return getExistingValues(downTable, req2, keys2).then((existingValues) => {
              const contexts = keys2.map((key, i) => {
                const existingValue = existingValues[i];
                const ctx = { onerror: null, onsuccess: null };
                if (req2.type === "delete") {
                  deleting.fire.call(ctx, key, existingValue, dxTrans2);
                } else if (req2.type === "add" || existingValue === void 0) {
                  const generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                  if (key == null && generatedPrimaryKey != null) {
                    key = generatedPrimaryKey;
                    req2.keys[i] = key;
                    if (!primaryKey.outbound) {
                      setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                    }
                  }
                } else {
                  const objectDiff = getObjectDiff(existingValue, req2.values[i]);
                  const additionalChanges = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                  if (additionalChanges) {
                    const requestedValue = req2.values[i];
                    Object.keys(additionalChanges).forEach((keyPath) => {
                      if (hasOwn(requestedValue, keyPath)) {
                        requestedValue[keyPath] = additionalChanges[keyPath];
                      } else {
                        setByKeyPath(requestedValue, keyPath, additionalChanges[keyPath]);
                      }
                    });
                  }
                }
                return ctx;
              });
              return downTable.mutate(req2).then(({ failures, results, numFailures, lastResult }) => {
                for (let i = 0; i < keys2.length; ++i) {
                  const primKey = results ? results[i] : keys2[i];
                  const ctx = contexts[i];
                  if (primKey == null) {
                    ctx.onerror && ctx.onerror(failures[i]);
                  } else {
                    ctx.onsuccess && ctx.onsuccess(
                      req2.type === "put" && existingValues[i] ? req2.values[i] : primKey
                    );
                  }
                }
                return { failures, results, numFailures, lastResult };
              }).catch((error) => {
                contexts.forEach((ctx) => ctx.onerror && ctx.onerror(error));
                return Promise.reject(error);
              });
            });
          }
          function deleteRange(req2) {
            return deleteNextChunk(req2.trans, req2.range, 1e4);
          }
          function deleteNextChunk(trans, range, limit) {
            return downTable.query({ trans, values: false, query: { index: primaryKey, range }, limit }).then(({ result }) => {
              return addPutOrDelete({ type: "delete", keys: result, trans }).then((res) => {
                if (res.numFailures > 0)
                  return Promise.reject(res.failures[0]);
                if (result.length < limit) {
                  return { failures: [], numFailures: 0, lastResult: void 0 };
                } else {
                  return deleteNextChunk(trans, { ...range, lower: result[result.length - 1], lowerOpen: true }, limit);
                }
              });
            });
          }
        }
      };
      return tableMiddleware;
    }
  })
};
function getExistingValues(table, req, effectiveKeys) {
  return req.type === "add" ? Promise.resolve([]) : table.getMany({ trans: req.trans, keys: effectiveKeys, cache: "immutable" });
}
function getFromTransactionCache(keys2, cache, clone2) {
  try {
    if (!cache)
      return null;
    if (cache.keys.length < keys2.length)
      return null;
    const result = [];
    for (let i = 0, j = 0; i < cache.keys.length && j < keys2.length; ++i) {
      if (cmp(cache.keys[i], keys2[j]) !== 0)
        continue;
      result.push(clone2 ? deepClone(cache.values[i]) : cache.values[i]);
      ++j;
    }
    return result.length === keys2.length ? result : null;
  } catch (_a) {
    return null;
  }
}
var cacheExistingValuesMiddleware = {
  stack: "dbcore",
  level: -1,
  create: (core) => {
    return {
      table: (tableName) => {
        const table = core.table(tableName);
        return {
          ...table,
          getMany: (req) => {
            if (!req.cache) {
              return table.getMany(req);
            }
            const cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
            if (cachedResult) {
              return DexiePromise.resolve(cachedResult);
            }
            return table.getMany(req).then((res) => {
              req.trans["_cache"] = {
                keys: req.keys,
                values: req.cache === "clone" ? deepClone(res) : res
              };
              return res;
            });
          },
          mutate: (req) => {
            if (req.type !== "add")
              req.trans["_cache"] = null;
            return table.mutate(req);
          }
        };
      }
    };
  }
};
function isEmptyRange(node) {
  return !("from" in node);
}
var RangeSet = function(fromOrTree, to) {
  if (this) {
    extend(this, arguments.length ? { d: 1, from: fromOrTree, to: arguments.length > 1 ? to : fromOrTree } : { d: 0 });
  } else {
    const rv = new RangeSet();
    if (fromOrTree && "d" in fromOrTree) {
      extend(rv, fromOrTree);
    }
    return rv;
  }
};
props(RangeSet.prototype, {
  add(rangeSet) {
    mergeRanges(this, rangeSet);
    return this;
  },
  addKey(key) {
    addRange(this, key, key);
    return this;
  },
  addKeys(keys2) {
    keys2.forEach((key) => addRange(this, key, key));
    return this;
  },
  [iteratorSymbol]() {
    return getRangeSetIterator(this);
  }
});
function addRange(target, from, to) {
  const diff = cmp(from, to);
  if (isNaN(diff))
    return;
  if (diff > 0)
    throw RangeError();
  if (isEmptyRange(target))
    return extend(target, { from, to, d: 1 });
  const left = target.l;
  const right = target.r;
  if (cmp(to, target.from) < 0) {
    left ? addRange(left, from, to) : target.l = { from, to, d: 1, l: null, r: null };
    return rebalance(target);
  }
  if (cmp(from, target.to) > 0) {
    right ? addRange(right, from, to) : target.r = { from, to, d: 1, l: null, r: null };
    return rebalance(target);
  }
  if (cmp(from, target.from) < 0) {
    target.from = from;
    target.l = null;
    target.d = right ? right.d + 1 : 1;
  }
  if (cmp(to, target.to) > 0) {
    target.to = to;
    target.r = null;
    target.d = target.l ? target.l.d + 1 : 1;
  }
  const rightWasCutOff = !target.r;
  if (left && !target.l) {
    mergeRanges(target, left);
  }
  if (right && rightWasCutOff) {
    mergeRanges(target, right);
  }
}
function mergeRanges(target, newSet) {
  function _addRangeSet(target2, { from, to, l, r }) {
    addRange(target2, from, to);
    if (l)
      _addRangeSet(target2, l);
    if (r)
      _addRangeSet(target2, r);
  }
  if (!isEmptyRange(newSet))
    _addRangeSet(target, newSet);
}
function rangesOverlap(rangeSet1, rangeSet2) {
  const i1 = getRangeSetIterator(rangeSet2);
  let nextResult1 = i1.next();
  if (nextResult1.done)
    return false;
  let a = nextResult1.value;
  const i2 = getRangeSetIterator(rangeSet1);
  let nextResult2 = i2.next(a.from);
  let b2 = nextResult2.value;
  while (!nextResult1.done && !nextResult2.done) {
    if (cmp(b2.from, a.to) <= 0 && cmp(b2.to, a.from) >= 0)
      return true;
    cmp(a.from, b2.from) < 0 ? a = (nextResult1 = i1.next(b2.from)).value : b2 = (nextResult2 = i2.next(a.from)).value;
  }
  return false;
}
function getRangeSetIterator(node) {
  let state = isEmptyRange(node) ? null : { s: 0, n: node };
  return {
    next(key) {
      const keyProvided = arguments.length > 0;
      while (state) {
        switch (state.s) {
          case 0:
            state.s = 1;
            if (keyProvided) {
              while (state.n.l && cmp(key, state.n.from) < 0)
                state = { up: state, n: state.n.l, s: 1 };
            } else {
              while (state.n.l)
                state = { up: state, n: state.n.l, s: 1 };
            }
          case 1:
            state.s = 2;
            if (!keyProvided || cmp(key, state.n.to) <= 0)
              return { value: state.n, done: false };
          case 2:
            if (state.n.r) {
              state.s = 3;
              state = { up: state, n: state.n.r, s: 0 };
              continue;
            }
          case 3:
            state = state.up;
        }
      }
      return { done: true };
    }
  };
}
function rebalance(target) {
  var _a, _b;
  const diff = (((_a = target.r) === null || _a === void 0 ? void 0 : _a.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
  const r = diff > 1 ? "r" : diff < -1 ? "l" : "";
  if (r) {
    const l = r === "r" ? "l" : "r";
    const rootClone = { ...target };
    const oldRootRight = target[r];
    target.from = oldRootRight.from;
    target.to = oldRootRight.to;
    target[r] = oldRootRight[r];
    rootClone[r] = oldRootRight[l];
    target[l] = rootClone;
    rootClone.d = computeDepth(rootClone);
  }
  target.d = computeDepth(target);
}
function computeDepth({ r, l }) {
  return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
}
var observabilityMiddleware = {
  stack: "dbcore",
  level: 0,
  create: (core) => {
    const dbName = core.schema.name;
    const FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
    return {
      ...core,
      table: (tableName) => {
        const table = core.table(tableName);
        const { schema } = table;
        const { primaryKey } = schema;
        const { extractKey, outbound } = primaryKey;
        const tableClone = {
          ...table,
          mutate: (req) => {
            const trans = req.trans;
            const mutatedParts = trans.mutatedParts || (trans.mutatedParts = {});
            const getRangeSet = (indexName) => {
              const part = `idb://${dbName}/${tableName}/${indexName}`;
              return mutatedParts[part] || (mutatedParts[part] = new RangeSet());
            };
            const pkRangeSet = getRangeSet("");
            const delsRangeSet = getRangeSet(":dels");
            const { type: type2 } = req;
            let [keys2, newObjs] = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [[], req.values] : [];
            const oldCache = req.trans["_cache"];
            return table.mutate(req).then((res) => {
              if (isArray(keys2)) {
                if (type2 !== "delete")
                  keys2 = res.results;
                pkRangeSet.addKeys(keys2);
                const oldObjs = getFromTransactionCache(keys2, oldCache);
                if (!oldObjs && type2 !== "add") {
                  delsRangeSet.addKeys(keys2);
                }
                if (oldObjs || newObjs) {
                  trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                }
              } else if (keys2) {
                const range = { from: keys2.lower, to: keys2.upper };
                delsRangeSet.add(range);
                pkRangeSet.add(range);
              } else {
                pkRangeSet.add(FULL_RANGE);
                delsRangeSet.add(FULL_RANGE);
                schema.indexes.forEach((idx) => getRangeSet(idx.name).add(FULL_RANGE));
              }
              return res;
            });
          }
        };
        const getRange = ({ query: { index, range } }) => {
          var _a, _b;
          return [
            index,
            new RangeSet((_a = range.lower) !== null && _a !== void 0 ? _a : core.MIN_KEY, (_b = range.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY)
          ];
        };
        const readSubscribers = {
          get: (req) => [primaryKey, new RangeSet(req.key)],
          getMany: (req) => [primaryKey, new RangeSet().addKeys(req.keys)],
          count: getRange,
          query: getRange,
          openCursor: getRange
        };
        keys(readSubscribers).forEach((method) => {
          tableClone[method] = function(req) {
            const { subscr } = PSD;
            if (subscr) {
              const getRangeSet = (indexName) => {
                const part = `idb://${dbName}/${tableName}/${indexName}`;
                return subscr[part] || (subscr[part] = new RangeSet());
              };
              const pkRangeSet = getRangeSet("");
              const delsRangeSet = getRangeSet(":dels");
              const [queriedIndex, queriedRanges] = readSubscribers[method](req);
              getRangeSet(queriedIndex.name || "").add(queriedRanges);
              if (!queriedIndex.isPrimaryKey) {
                if (method === "count") {
                  delsRangeSet.add(FULL_RANGE);
                } else {
                  const keysPromise = method === "query" && outbound && req.values && table.query({
                    ...req,
                    values: false
                  });
                  return table[method].apply(this, arguments).then((res) => {
                    if (method === "query") {
                      if (outbound && req.values) {
                        return keysPromise.then(({ result: resultingKeys }) => {
                          pkRangeSet.addKeys(resultingKeys);
                          return res;
                        });
                      }
                      const pKeys = req.values ? res.result.map(extractKey) : res.result;
                      if (req.values) {
                        pkRangeSet.addKeys(pKeys);
                      } else {
                        delsRangeSet.addKeys(pKeys);
                      }
                    } else if (method === "openCursor") {
                      const cursor = res;
                      const wantValues = req.values;
                      return cursor && Object.create(cursor, {
                        key: {
                          get() {
                            delsRangeSet.addKey(cursor.primaryKey);
                            return cursor.key;
                          }
                        },
                        primaryKey: {
                          get() {
                            const pkey = cursor.primaryKey;
                            delsRangeSet.addKey(pkey);
                            return pkey;
                          }
                        },
                        value: {
                          get() {
                            wantValues && pkRangeSet.addKey(cursor.primaryKey);
                            return cursor.value;
                          }
                        }
                      });
                    }
                    return res;
                  });
                }
              }
            }
            return table[method].apply(this, arguments);
          };
        });
        return tableClone;
      }
    };
  }
};
function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
  function addAffectedIndex(ix) {
    const rangeSet = getRangeSet(ix.name || "");
    function extractKey(obj) {
      return obj != null ? ix.extractKey(obj) : null;
    }
    const addKeyOrKeys = (key) => ix.multiEntry && isArray(key) ? key.forEach((key2) => rangeSet.addKey(key2)) : rangeSet.addKey(key);
    (oldObjs || newObjs).forEach((_, i) => {
      const oldKey = oldObjs && extractKey(oldObjs[i]);
      const newKey = newObjs && extractKey(newObjs[i]);
      if (cmp(oldKey, newKey) !== 0) {
        if (oldKey != null)
          addKeyOrKeys(oldKey);
        if (newKey != null)
          addKeyOrKeys(newKey);
      }
    });
  }
  schema.indexes.forEach(addAffectedIndex);
}
var Dexie$1 = class _Dexie$1 {
  constructor(name, options) {
    this._middlewares = {};
    this.verno = 0;
    const deps = _Dexie$1.dependencies;
    this._options = options = {
      addons: _Dexie$1.addons,
      autoOpen: true,
      indexedDB: deps.indexedDB,
      IDBKeyRange: deps.IDBKeyRange,
      ...options
    };
    this._deps = {
      indexedDB: options.indexedDB,
      IDBKeyRange: options.IDBKeyRange
    };
    const { addons } = options;
    this._dbSchema = {};
    this._versions = [];
    this._storeNames = [];
    this._allTables = {};
    this.idbdb = null;
    this._novip = this;
    const state = {
      dbOpenError: null,
      isBeingOpened: false,
      onReadyBeingFired: null,
      openComplete: false,
      dbReadyResolve: nop,
      dbReadyPromise: null,
      cancelOpen: nop,
      openCanceller: null,
      autoSchema: true,
      PR1398_maxLoop: 3
    };
    state.dbReadyPromise = new DexiePromise((resolve) => {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise((_, reject) => {
      state.cancelOpen = reject;
    });
    this._state = state;
    this.name = name;
    this.on = Events(this, "populate", "blocked", "versionchange", "close", { ready: [promisableChain, nop] });
    this.on.ready.subscribe = override(this.on.ready.subscribe, (subscribe) => {
      return (subscriber, bSticky) => {
        _Dexie$1.vip(() => {
          const state2 = this._state;
          if (state2.openComplete) {
            if (!state2.dbOpenError)
              DexiePromise.resolve().then(subscriber);
            if (bSticky)
              subscribe(subscriber);
          } else if (state2.onReadyBeingFired) {
            state2.onReadyBeingFired.push(subscriber);
            if (bSticky)
              subscribe(subscriber);
          } else {
            subscribe(subscriber);
            const db = this;
            if (!bSticky)
              subscribe(function unsubscribe() {
                db.on.ready.unsubscribe(subscriber);
                db.on.ready.unsubscribe(unsubscribe);
              });
          }
        });
      };
    });
    this.Collection = createCollectionConstructor(this);
    this.Table = createTableConstructor(this);
    this.Transaction = createTransactionConstructor(this);
    this.Version = createVersionConstructor(this);
    this.WhereClause = createWhereClauseConstructor(this);
    this.on("versionchange", (ev) => {
      if (ev.newVersion > 0)
        console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`);
      else
        console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`);
      this.close();
    });
    this.on("blocked", (ev) => {
      if (!ev.newVersion || ev.newVersion < ev.oldVersion)
        console.warn(`Dexie.delete('${this.name}') was blocked`);
      else
        console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${ev.oldVersion / 10}`);
    });
    this._maxKey = getMaxKey(options.IDBKeyRange);
    this._createTransaction = (mode, storeNames, dbschema, parentTransaction) => new this.Transaction(mode, storeNames, dbschema, this._options.chromeTransactionDurability, parentTransaction);
    this._fireOnBlocked = (ev) => {
      this.on("blocked").fire(ev);
      connections.filter((c) => c.name === this.name && c !== this && !c._state.vcFired).map((c) => c.on("versionchange").fire(ev));
    };
    this.use(virtualIndexMiddleware);
    this.use(hooksMiddleware);
    this.use(observabilityMiddleware);
    this.use(cacheExistingValuesMiddleware);
    this.vip = Object.create(this, { _vip: { value: true } });
    addons.forEach((addon) => addon(this));
  }
  version(versionNumber) {
    if (isNaN(versionNumber) || versionNumber < 0.1)
      throw new exceptions.Type(`Given version is not a positive number`);
    versionNumber = Math.round(versionNumber * 10) / 10;
    if (this.idbdb || this._state.isBeingOpened)
      throw new exceptions.Schema("Cannot add version when database is open");
    this.verno = Math.max(this.verno, versionNumber);
    const versions = this._versions;
    var versionInstance = versions.filter((v) => v._cfg.version === versionNumber)[0];
    if (versionInstance)
      return versionInstance;
    versionInstance = new this.Version(versionNumber);
    versions.push(versionInstance);
    versions.sort(lowerVersionFirst);
    versionInstance.stores({});
    this._state.autoSchema = false;
    return versionInstance;
  }
  _whenReady(fn) {
    return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise((resolve, reject) => {
      if (this._state.openComplete) {
        return reject(new exceptions.DatabaseClosed(this._state.dbOpenError));
      }
      if (!this._state.isBeingOpened) {
        if (!this._options.autoOpen) {
          reject(new exceptions.DatabaseClosed());
          return;
        }
        this.open().catch(nop);
      }
      this._state.dbReadyPromise.then(resolve, reject);
    }).then(fn);
  }
  use({ stack, create, level, name }) {
    if (name)
      this.unuse({ stack, name });
    const middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
    middlewares.push({ stack, create, level: level == null ? 10 : level, name });
    middlewares.sort((a, b2) => a.level - b2.level);
    return this;
  }
  unuse({ stack, name, create }) {
    if (stack && this._middlewares[stack]) {
      this._middlewares[stack] = this._middlewares[stack].filter((mw) => create ? mw.create !== create : name ? mw.name !== name : false);
    }
    return this;
  }
  open() {
    return dexieOpen(this);
  }
  _close() {
    const state = this._state;
    const idx = connections.indexOf(this);
    if (idx >= 0)
      connections.splice(idx, 1);
    if (this.idbdb) {
      try {
        this.idbdb.close();
      } catch (e) {
      }
      this._novip.idbdb = null;
    }
    state.dbReadyPromise = new DexiePromise((resolve) => {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise((_, reject) => {
      state.cancelOpen = reject;
    });
  }
  close() {
    this._close();
    const state = this._state;
    this._options.autoOpen = false;
    state.dbOpenError = new exceptions.DatabaseClosed();
    if (state.isBeingOpened)
      state.cancelOpen(state.dbOpenError);
  }
  delete() {
    const hasArguments = arguments.length > 0;
    const state = this._state;
    return new DexiePromise((resolve, reject) => {
      const doDelete = () => {
        this.close();
        var req = this._deps.indexedDB.deleteDatabase(this.name);
        req.onsuccess = wrap2(() => {
          _onDatabaseDeleted(this._deps, this.name);
          resolve();
        });
        req.onerror = eventRejectHandler(reject);
        req.onblocked = this._fireOnBlocked;
      };
      if (hasArguments)
        throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
      if (state.isBeingOpened) {
        state.dbReadyPromise.then(doDelete);
      } else {
        doDelete();
      }
    });
  }
  backendDB() {
    return this.idbdb;
  }
  isOpen() {
    return this.idbdb !== null;
  }
  hasBeenClosed() {
    const dbOpenError = this._state.dbOpenError;
    return dbOpenError && dbOpenError.name === "DatabaseClosed";
  }
  hasFailed() {
    return this._state.dbOpenError !== null;
  }
  dynamicallyOpened() {
    return this._state.autoSchema;
  }
  get tables() {
    return keys(this._allTables).map((name) => this._allTables[name]);
  }
  transaction() {
    const args = extractTransactionArgs.apply(this, arguments);
    return this._transaction.apply(this, args);
  }
  _transaction(mode, tables, scopeFunc) {
    let parentTransaction = PSD.trans;
    if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1)
      parentTransaction = null;
    const onlyIfCompatible = mode.indexOf("?") !== -1;
    mode = mode.replace("!", "").replace("?", "");
    let idbMode, storeNames;
    try {
      storeNames = tables.map((table) => {
        var storeName = table instanceof this.Table ? table.name : table;
        if (typeof storeName !== "string")
          throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
        return storeName;
      });
      if (mode == "r" || mode === READONLY)
        idbMode = READONLY;
      else if (mode == "rw" || mode == READWRITE)
        idbMode = READWRITE;
      else
        throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
      if (parentTransaction) {
        if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
          if (onlyIfCompatible) {
            parentTransaction = null;
          } else
            throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
        }
        if (parentTransaction) {
          storeNames.forEach((storeName) => {
            if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
              if (onlyIfCompatible) {
                parentTransaction = null;
              } else
                throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
            }
          });
        }
        if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
          parentTransaction = null;
        }
      }
    } catch (e) {
      return parentTransaction ? parentTransaction._promise(null, (_, reject) => {
        reject(e);
      }) : rejection(e);
    }
    const enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
    return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, () => this._whenReady(enterTransaction)) : this._whenReady(enterTransaction);
  }
  table(tableName) {
    if (!hasOwn(this._allTables, tableName)) {
      throw new exceptions.InvalidTable(`Table ${tableName} does not exist`);
    }
    return this._allTables[tableName];
  }
};
var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
var Observable = class {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(x, error, complete) {
    return this._subscribe(!x || typeof x === "function" ? { next: x, error, complete } : x);
  }
  [symbolObservable]() {
    return this;
  }
};
function extendObservabilitySet(target, newSet) {
  keys(newSet).forEach((part) => {
    const rangeSet = target[part] || (target[part] = new RangeSet());
    mergeRanges(rangeSet, newSet[part]);
  });
  return target;
}
function liveQuery(querier) {
  let hasValue = false;
  let currentValue = void 0;
  const observable = new Observable((observer) => {
    const scopeFuncIsAsync = isAsyncFunction(querier);
    function execute(subscr) {
      if (scopeFuncIsAsync) {
        incrementExpectedAwaits();
      }
      const exec = () => newScope(querier, { subscr, trans: null });
      const rv = PSD.trans ? usePSD(PSD.transless, exec) : exec();
      if (scopeFuncIsAsync) {
        rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
      }
      return rv;
    }
    let closed = false;
    let accumMuts = {};
    let currentObs = {};
    const subscription = {
      get closed() {
        return closed;
      },
      unsubscribe: () => {
        closed = true;
        globalEvents.storagemutated.unsubscribe(mutationListener);
      }
    };
    observer.start && observer.start(subscription);
    let querying = false, startedListening = false;
    function shouldNotify() {
      return keys(currentObs).some((key) => accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key]));
    }
    const mutationListener = (parts) => {
      extendObservabilitySet(accumMuts, parts);
      if (shouldNotify()) {
        doQuery();
      }
    };
    const doQuery = () => {
      if (querying || closed)
        return;
      accumMuts = {};
      const subscr = {};
      const ret = execute(subscr);
      if (!startedListening) {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
        startedListening = true;
      }
      querying = true;
      Promise.resolve(ret).then((result) => {
        hasValue = true;
        currentValue = result;
        querying = false;
        if (closed)
          return;
        if (shouldNotify()) {
          doQuery();
        } else {
          accumMuts = {};
          currentObs = subscr;
          observer.next && observer.next(result);
        }
      }, (err) => {
        querying = false;
        hasValue = false;
        observer.error && observer.error(err);
        subscription.unsubscribe();
      });
    };
    doQuery();
    return subscription;
  });
  observable.hasValue = () => hasValue;
  observable.getValue = () => currentValue;
  return observable;
}
var domDeps;
try {
  domDeps = {
    indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
    IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
  };
} catch (e) {
  domDeps = { indexedDB: null, IDBKeyRange: null };
}
var Dexie = Dexie$1;
props(Dexie, {
  ...fullNameExceptions,
  delete(databaseName) {
    const db = new Dexie(databaseName, { addons: [] });
    return db.delete();
  },
  exists(name) {
    return new Dexie(name, { addons: [] }).open().then((db) => {
      db.close();
      return true;
    }).catch("NoSuchDatabaseError", () => false);
  },
  getDatabaseNames(cb) {
    try {
      return getDatabaseNames(Dexie.dependencies).then(cb);
    } catch (_a) {
      return rejection(new exceptions.MissingAPI());
    }
  },
  defineClass() {
    function Class(content) {
      extend(this, content);
    }
    return Class;
  },
  ignoreTransaction(scopeFunc) {
    return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
  },
  vip,
  async: function(generatorFn) {
    return function() {
      try {
        var rv = awaitIterator(generatorFn.apply(this, arguments));
        if (!rv || typeof rv.then !== "function")
          return DexiePromise.resolve(rv);
        return rv;
      } catch (e) {
        return rejection(e);
      }
    };
  },
  spawn: function(generatorFn, args, thiz) {
    try {
      var rv = awaitIterator(generatorFn.apply(thiz, args || []));
      if (!rv || typeof rv.then !== "function")
        return DexiePromise.resolve(rv);
      return rv;
    } catch (e) {
      return rejection(e);
    }
  },
  currentTransaction: {
    get: () => PSD.trans || null
  },
  waitFor: function(promiseOrFunction, optionalTimeout) {
    const promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
    return PSD.trans ? PSD.trans.waitFor(promise) : promise;
  },
  Promise: DexiePromise,
  debug: {
    get: () => debug,
    set: (value) => {
      setDebug(value, value === "dexie" ? () => true : dexieStackFrameFilter);
    }
  },
  derive,
  extend,
  props,
  override,
  Events,
  on: globalEvents,
  liveQuery,
  extendObservabilitySet,
  getByKeyPath,
  setByKeyPath,
  delByKeyPath,
  shallowClone,
  deepClone,
  getObjectDiff,
  cmp,
  asap: asap$1,
  minKey,
  addons: [],
  connections,
  errnames,
  dependencies: domDeps,
  semVer: DEXIE_VERSION,
  version: DEXIE_VERSION.split(".").map((n) => parseInt(n)).reduce((p, c, i) => p + c / Math.pow(10, i * 2))
});
Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);
if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (updatedParts) => {
    if (!propagatingLocally) {
      let event;
      if (isIEOrEdge) {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, true, true, updatedParts);
      } else {
        event = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
          detail: updatedParts
        });
      }
      propagatingLocally = true;
      dispatchEvent(event);
      propagatingLocally = false;
    }
  });
  addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, ({ detail }) => {
    if (!propagatingLocally) {
      propagateLocally(detail);
    }
  });
}
function propagateLocally(updateParts) {
  let wasMe = propagatingLocally;
  try {
    propagatingLocally = true;
    globalEvents.storagemutated.fire(updateParts);
  } finally {
    propagatingLocally = wasMe;
  }
}
var propagatingLocally = false;
if (typeof BroadcastChannel !== "undefined") {
  const bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
  if (typeof bc.unref === "function") {
    bc.unref();
  }
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
    if (!propagatingLocally) {
      bc.postMessage(changedParts);
    }
  });
  bc.onmessage = (ev) => {
    if (ev.data)
      propagateLocally(ev.data);
  };
} else if (typeof self !== "undefined" && typeof navigator !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, (changedParts) => {
    try {
      if (!propagatingLocally) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(STORAGE_MUTATED_DOM_EVENT_NAME, JSON.stringify({
            trig: Math.random(),
            changedParts
          }));
        }
        if (typeof self["clients"] === "object") {
          [...self["clients"].matchAll({ includeUncontrolled: true })].forEach((client) => client.postMessage({
            type: STORAGE_MUTATED_DOM_EVENT_NAME,
            changedParts
          }));
        }
      }
    } catch (_a) {
    }
  });
  if (typeof addEventListener !== "undefined") {
    addEventListener("storage", (ev) => {
      if (ev.key === STORAGE_MUTATED_DOM_EVENT_NAME) {
        const data = JSON.parse(ev.newValue);
        if (data)
          propagateLocally(data.changedParts);
      }
    });
  }
  const swContainer = self.document && navigator.serviceWorker;
  if (swContainer) {
    swContainer.addEventListener("message", propagateMessageLocally);
  }
}
function propagateMessageLocally({ data }) {
  if (data && data.type === STORAGE_MUTATED_DOM_EVENT_NAME) {
    propagateLocally(data.changedParts);
  }
}
DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);

// app/database.ts
var DATABASE_NAME = "client-state";
var STORES = {
  flights: "flightId",
  selections: "++id"
};
function createStorageRepository() {
  const db = new Dexie$1(DATABASE_NAME, { autoOpen: true });
  db.version(1).stores(STORES);
  return {
    flights: db.flights,
    selections: db.selections
  };
}
var database_default = createStorageRepository;

// app/entry.worker.ts
var CURRENT_CACHE_VERSION = "v2";
var assetCache = new EnhancedCache("remix-assets", {
  version: CURRENT_CACHE_VERSION,
  strategy: "CacheFirst",
  strategyOptions: {
    maxEntries: 2,
    maxAgeSeconds: 60,
    cacheableResponse: false
  }
});
registerQueue("offline-action");
var getLoadContext = () => {
  const stores = database_default();
  return {
    database: stores
  };
};
self.addEventListener("install", (event) => {
  logger.log("installing service worker");
  logger.warn("This is a playground service worker \u{1F4E6}. It is not intended for production use.");
  event.waitUntil(
    Promise.all([
      self.skipWaiting(),
      assetCache.preCacheUrls(["/entry.worker.css"])
      // assetCache.preCacheUrls(self.__workerManifest.assets) // - Ideal, lol. We wish!
    ])
  );
});
self.addEventListener("activate", (event) => {
  logger.log(self.clients, "manifest:\n", self.__workerManifest);
  event.waitUntil(
    Promise.all([
      clearUpOldCaches(["remix-assets"], CURRENT_CACHE_VERSION)
    ]).then(() => {
      self.clients.claim();
    })
  );
});
new NavigationHandler({
  documentCache: new EnhancedCache("remix-document", {
    version: CURRENT_CACHE_VERSION,
    strategy: "CacheFirst",
    strategyOptions: {
      maxEntries: 10,
      maxAgeSeconds: 60,
      cacheableResponse: {
        statuses: [200]
      }
    }
  })
});

// entry-module:@remix-pwa/build/magic
var route0 = __toESM(require_root());

// routes-module:routes/basic-caching.tsx?worker
var basic_caching_exports = {};
__export(basic_caching_exports, {
  workerLoader: () => workerLoader
});

// ../node_modules/cachified/dist/index.mjs
var k = Symbol();
var w = Symbol();
var f = Symbol();

// ../node_modules/uint8array-extras/index.js
var objectToString = Object.prototype.toString;
var uint8ArrayStringified = "[object Uint8Array]";
function isUint8Array(value) {
  if (!value) {
    return false;
  }
  if (value.constructor === Uint8Array) {
    return true;
  }
  return objectToString.call(value) === uint8ArrayStringified;
}
function assertUint8Array(value) {
  if (!isUint8Array(value)) {
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof value}\``);
  }
}
var cachedDecoder = new globalThis.TextDecoder();
function uint8ArrayToString(array) {
  assertUint8Array(array);
  return cachedDecoder.decode(array);
}
var cachedEncoder = new globalThis.TextEncoder();
var byteToHexLookupTable = Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));

// ../node_modules/js-base64/base64.mjs
var _hasatob = typeof atob === "function";
var _hasBuffer = typeof Buffer === "function";
var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64chs = Array.prototype.slice.call(b64ch);
var b64tab = ((a) => {
  let tab = {};
  a.forEach((c, i) => tab[c] = i);
  return tab;
})(b64chs);
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
var _fromCC = String.fromCharCode.bind(String);
var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
var _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
var atobPolyfill = (asc) => {
  asc = asc.replace(/\s+/g, "");
  if (!b64re.test(asc))
    throw new TypeError("malformed base64.");
  asc += "==".slice(2 - (asc.length & 3));
  let u24, bin = "", r1, r2;
  for (let i = 0; i < asc.length; ) {
    u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
    bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
  }
  return bin;
};
var _atob = _hasatob ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;

// ../packages/cache/dist/src/utils.js
function mergeHeaders(...headers) {
  const merged = new Headers();
  for (const header of headers) {
    if (!header)
      continue;
    for (const [key, value] of new Headers(header).entries()) {
      merged.set(key, value);
    }
  }
  return merged;
}
function omit(key, obj) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}
function assertString(value) {
  if (typeof value !== "string") {
    throw new TypeError(`Expected \`string\`, got \`${typeof value}\``);
  }
}
function base64UrlToBase64(base64url) {
  return base64url.replaceAll("-", "+").replaceAll("_", "/");
}
function base64ToUint8Array(base64String) {
  assertString(base64String);
  return Uint8Array.from(_atob(base64UrlToBase64(base64String)), (x) => x.codePointAt(0));
}

// ../packages/cache/dist/src/cache.js
var Strategy;
(function(Strategy2) {
  Strategy2["CacheFirst"] = "cache-first";
  Strategy2["NetworkFirst"] = "network-first";
  Strategy2["CacheOnly"] = "cache-only";
  Strategy2["NetworkOnly"] = "network-only";
  Strategy2["StaleWhileRevalidate"] = "stale-while-revalidate";
})(Strategy || (Strategy = {}));
var RemixCache = class {
  /**
   * Create a new `RemixCache` instance. Don't invoke this directly! Use `RemixCacheStorage.open()` instead.
   * @constructor
   * @param {object} options - Options for the RemixCache instance.
   */
  constructor(options) {
    this._ttl = Infinity;
    this._strategy = Strategy.NetworkFirst;
    this._maxItems = 100;
    this.set = false;
    this.name = options.name;
    this._maxItems = options.maxItems || 100;
    this._strategy = options.strategy || Strategy.NetworkFirst;
    this._ttl = options.ttl || Infinity;
    if (this._strategy === Strategy.NetworkOnly) {
      this._ttl = -1;
    }
    if (options.maxItems || options.ttl || options.strategy) {
      this.set = true;
    } else {
      this.set = false;
    }
  }
  async _openCache() {
    return await caches.open(`rp-${this.name}`);
  }
  async _getOrDeleteIfExpired(key, metadata) {
    if (metadata.expiresAt === "Infinity") {
      return false;
    }
    if (Number(metadata.expiresAt) <= Date.now()) {
      return await this.delete(key);
    }
    return false;
  }
  async _lruCleanup() {
    const isOverflowing = await this.length() >= this._maxItems;
    if (isOverflowing) {
      const cache = await this._openCache();
      const keys2 = await cache.keys();
      const values = await Promise.all(keys2.map((key) => cache.match(key)));
      const keyVal = keys2.map((key, i) => ({ key, val: values[i] }));
      const comparableArrayPromise = keyVal.map(async (val) => {
        const { metadata } = await val.val.clone().json();
        return {
          metadata,
          url: val.key.url
        };
      });
      const comparableArray = await Promise.all(comparableArrayPromise);
      const sortedArr = comparableArray.sort((a, b2) => {
        return Number(a.metadata.accessedAt) - Number(b2.metadata.accessedAt);
      });
      const toBeDeletdItems = sortedArr.slice(0, sortedArr.length - this._maxItems + 1);
      for (const deleted of toBeDeletdItems) {
        await this.delete(deleted.url);
      }
    }
  }
  async _getResponseValue(request, response) {
    const { metadata, value } = await response.clone().json();
    const deleted = await this._getOrDeleteIfExpired(request, metadata);
    const headers = new Headers(response.clone().headers);
    if (!this.set) {
      this.set = true;
      this._ttl = metadata.cacheTtl;
      this._maxItems = metadata.cacheMaxItems;
      this._strategy = metadata.cacheStrategy;
    }
    const newHeader = new Headers(headers);
    newHeader.set("X-Remix-PWA-TTL", metadata.expiresAt.toString());
    newHeader.set("X-Remix-PWA-AccessTime", Date.now().toString());
    newHeader.set("Content-Type", headers.get("X-Remix-PWA-Original-Content-Type") || "application/json");
    const contentType = headers.get("X-Remix-PWA-Original-Content-Type") ?? "";
    newHeader.delete("X-Remix-PWA-Original-Content-Type");
    const responseOptions = {
      status: response.status,
      statusText: response.statusText,
      headers: newHeader,
      body: "null"
    };
    if (contentType.includes("application/json")) {
      responseOptions.body = JSON.stringify(value);
    } else if (contentType.includes("text")) {
      responseOptions.body = value;
    } else {
      responseOptions.body = base64ToUint8Array(value);
    }
    if (!deleted) {
      const res = new Response(responseOptions.body, omit("body", responseOptions));
      await this.put(request, res.clone(), void 0);
      return res;
    }
    return void 0;
  }
  /**
   * Delete an entry from the cache.
   * Takes in the same parameters as `Cache.delete`.
   * @param {RequestInfo | URL} request - The request to delete.
   * @param {CacheQueryOptions} [options] - Options for the delete operation.
   * @returns {Promise<boolean>} Returns `true` if an entry was deleted, otherwise `false`.
   *
   * @example
   * ```js
   * const cache = await initCache({ name: 'my-cache' });
   *
   * await cache.put('/hello-world', new Response('Hello World!'));
   * await cache.delete('/hello-world');
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete
   */
  async delete(request, options) {
    return this._openCache().then((cache) => cache.delete(request, options));
  }
  /**
   * Returns a Promise that resolves to the length of the Cache object.
   *
   * @returns {Promise<number>} The number of entries in the cache.
   */
  async length() {
    const keys2 = await this.keys();
    return keys2.length;
  }
  /**
   * Returns a `Promise` that resolves to an array of Cache keys.
   *
   * @returns {Promise<readonly Request[]>} An array of Cache keys.
   */
  async keys() {
    const cache = await this._openCache();
    return await cache.keys();
  }
  /**
   * Return a `Promise` that resolves to an entry in the cache object. Accepts the
   * same parameters as `Cache.match`.
   *
   * @param {RequestInfo | URL} request - The request to match.
   * @param {CacheQueryOptions} [options] - Options for the match operation.
   *
   * @returns {Promise<Response | undefined>} A `Promise` that resolves to the response, or `undefined` if not found.
   */
  async match(request, options) {
    const cache = await this._openCache();
    if (request instanceof URL || typeof request === "string") {
      request = new Request(request);
    }
    const response = await cache.match(request.clone(), options);
    if (!response) {
      return void 0;
    }
    return await this._getResponseValue(request, response.clone());
  }
  /**
   * Add an entry to the cache.
   * Takes in the same parameters as `Cache.put`.
   *
   * @param {RequestInfo | URL} request - The request to add.
   * @param {Response} response - The response to add.
   * @param {number | undefined} ttl - The time-to-live of the cache entry in ms. Defaults to cache ttl.
   * @returns {Promise<void>} A `Promise` that resolves when the entry is added to the cache.
   *
   * @example
   * ```js
   * const cache = await initCache({ name: 'my-cache' });
   *
   * await cache.put('/hello-world', new Response('Hello World!'));
   * ```
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Cache/put
   */
  async put(request, response, ttl = void 0) {
    const cache = await this._openCache();
    if (request instanceof URL || typeof request === "string") {
      request = new Request(request);
    }
    if (this._ttl <= 0 || ttl && ttl <= 0)
      return;
    if (response === null || response.status === 204 || response.statusText.toLowerCase() === "no content") {
      await this.delete(request);
      return;
    }
    const contentType = response.headers.get("Content-Type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.clone().json();
    } else if (contentType && contentType.includes("text")) {
      data = await response.clone().text();
    } else {
      const buffer = await response.clone().arrayBuffer();
      data = uint8ArrayToString(new Uint8Array(buffer));
    }
    if (!this.set) {
      this.set = true;
      const keys2 = await cache.keys();
      const firstVal = await cache.match(keys2[0]);
      if (firstVal) {
        const { metadata } = await firstVal.clone().json();
        this._ttl = metadata.cacheTtl;
        this._maxItems = metadata.cacheMaxItems;
        this._strategy = metadata.cacheStrategy;
      } else {
        this._ttl = Infinity;
        this._maxItems = 100;
        this._strategy = Strategy.NetworkFirst;
      }
    }
    const resHeaders = response.headers;
    const expiresAt = resHeaders.get("X-Remix-PWA-TTL") || Date.now() + (ttl ?? this._ttl);
    const accessedAt = resHeaders.get("X-Remix-PWA-AccessTime") || Date.now().toString();
    const newHeaders = new Headers();
    newHeaders.set("Content-Type", "application/json");
    newHeaders.set("X-Remix-PWA-AccessTime", accessedAt);
    newHeaders.set("X-Remix-PWA-Original-Content-Type", contentType || "text/plain");
    newHeaders.set("X-Remix-PWA-TTL", expiresAt.toString());
    const toBeCachedRes = new Response(JSON.stringify({
      metadata: {
        accessedAt,
        // JSON can't store `Infinity`, so we store it as a string
        expiresAt: expiresAt.toString(),
        cacheTtl: this._ttl.toString(),
        cacheMaxItems: this._maxItems,
        cacheStrategy: this._strategy
      },
      value: data
    }), {
      status: response.status,
      statusText: response.statusText,
      headers: mergeHeaders(resHeaders, newHeaders)
    });
    Object.defineProperty(toBeCachedRes, "url", { value: response.url });
    Object.defineProperty(toBeCachedRes, "type", { value: response.type });
    Object.defineProperty(toBeCachedRes, "ok", { value: response.ok });
    Object.defineProperty(toBeCachedRes, "redirected", { value: response.redirected });
    try {
      await this._lruCleanup();
      return await cache.put(request, toBeCachedRes.clone());
    } catch (error) {
      if (true)
        console.error("Failed to put to cache:", error);
    }
  }
  async add(request) {
    return (
      /* await - should this be awaited? */
      fetch(request).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        return this.put(request, res.clone());
      })
    );
  }
  get ttl() {
    return this._ttl;
  }
  get strategy() {
    return this._strategy;
  }
};

// ../packages/cache/dist/src/storage.js
var RemixCacheStorage = class {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
  }
  /**
   * Initialize the Remix PWA Cache Storage. This will create a special cache for each
   * existing cache in the browser or create a new map if none exist.
   *
   * Use in your service worker installation script. Make sure to call this before
   * initializing any `RemixCache` instance.
   *
   * @example
   * ```js
   * import { RemixCacheStorage } from '@remix-run/cache';
   *
   * self.addEventListener('install', (event) => {
   *  event.waitUntil(Promise.all[
   *   RemixCacheStorage.init(),
   *   // other stuff
   *  ]);
   * });
   * ```
   */
  // static async init() {
  //   if (typeof caches === 'undefined') {
  //     throw new Error('Cache API is not available in this environment.');
  //   }
  //   if (this._instances.size > 0) {
  //     return;
  //   }
  //   const cachesNames = await caches.keys();
  //   for (const name of cachesNames) {
  //     if (name.startsWith('rp-')) {
  //       this._instances.set(name, new RemixCache({ name }));
  //     }
  //   }
  // }
  /**
   * Create a custom cache that you can use across your application.
   * Use this instead of initialising `RemixCache` directly.
   */
  static createCache(opts) {
    const { name } = opts;
    if (this._instances.has(name)) {
      return this._instances.get(name);
    }
    const newCache = new RemixCache(opts);
    this._instances.set(`${name}`, newCache);
    caches.open(`rp-${name}`);
    return newCache;
  }
  /**
   * Check wether a cache with the given name exists.
   *
   * @param name
   */
  static has(name) {
    return this._instances.has(name);
  }
  static async _get(name) {
    const cache = this._instances.get(name);
    if (!cache && await caches.has(`rp-${name}`)) {
      this._instances.set(name, new RemixCache({ name }));
      await this._instances.get(name)?.keys().then((keys2) => {
        if (keys2.length > 0) {
          caches.match(keys2[0]);
        }
      });
    }
    return this._instances.get(name);
  }
  /**
   * Get a cache by name. Returns `undefined` if no cache with the given name exists.
   * Use `has` to check if a cache exists. Or `open` to create one automatically if non exists.
   *
   * @param name
   * @returns {RemixCache | undefined}
   *
   * @example
   * ```js
   * import { Storage } from '@remix-run/cache';
   *
   * const cache = Storage.get('my-cache');
   * ```
   */
  static async get(name) {
    return await this._get(name);
  }
  /**
   * Get a cache by name. If no cache with the given name exists, create one.
   *
   * @param name Name of the cache - **must be unique**
   * @param opts Options to pass to the `RemixCache` constructor if the cache is getting created
   * @returns {RemixCache}
   *
   * @example
   * ```js
   * import { Storage } from '@remix-run/cache';
   *
   * const cache = Storage.open('my-cache');
   * ```
   */
  static open(name, opts) {
    const cache = this._instances.get(name);
    if (!cache) {
      return this.createCache({ name, ...opts });
    }
    return cache;
  }
  /**
   * Delete a cache by name.
   *
   * @param name
   */
  static delete(name) {
    const cache = this._instances.get(name);
    if (cache) {
      caches.delete(`rp-${name}`);
      this._instances.delete(name);
    }
  }
  /**
   * Delete all caches.
   */
  static clear() {
    caches.keys().then((keys2) => keys2.forEach((key) => key.startsWith("rp-") ? caches.delete(key) : null));
    this._instances = /* @__PURE__ */ new Map();
  }
  /**
   * Get all caches. **Don't use this except you know what you are doing!**
   *
   * Which, frankly speaking, you probably don't. So shoo away!
   */
  static get instances() {
    return this._instances;
  }
  /**
   * Get the number of caches.
   *
   * Return the length of the `RemixCacheStorage` store.
   */
  static get _length() {
    return this._instances.size;
  }
  /**
   * Check if a request is stored as the key of a response in all caches.
   *
   * Experimental. Use at your own risk!
   *
   * @param {RequestInfo | URL} request The request to check.
   * @param {CacheQueryOptions} [options] Options to pass to the `Cache.match` method.
   * @returns {Promise<Response | undefined>} A promise that resolves to the response if found, otherwise `undefined`.
   */
  static _match(request, options) {
    return caches.match(request, options);
  }
};
RemixCacheStorage._instances = /* @__PURE__ */ new Map();
var Storage = RemixCacheStorage;

// ../packages/strategy/dist/src/utils.js
var isHttpRequest = (request) => {
  if (request instanceof Request) {
    return request.url.startsWith("http");
  }
  return request.toString().startsWith("http");
};
var toJSON = async (response) => {
  if (response instanceof Response) {
    return await response.clone().json();
  }
  return response;
};

// ../packages/strategy/dist/src/cacheFirst.js
var cacheFirst = ({ cache: cacheName, cacheOptions, cacheQueryOptions, fetchDidFail = void 0 }) => {
  return async (request) => {
    if (!isHttpRequest(request)) {
      return new Response("Not a HTTP request", { status: 403 });
    }
    let remixCache;
    if (typeof cacheName === "string") {
      remixCache = Storage.open(cacheName, cacheOptions);
    } else {
      remixCache = cacheName;
    }
    const response = await remixCache.match(request, cacheQueryOptions);
    if (!response) {
      try {
        const networkResponse = await fetch(request);
        remixCache.put(request, networkResponse.clone());
        return networkResponse;
      } catch (err) {
        if (fetchDidFail) {
          await Promise.all(fetchDidFail.map((cb) => cb()));
        }
        throw err;
      }
    }
    return response;
  };
};

// ../packages/strategy/dist/src/cacheOnly.js
var cacheOnly = ({ cache: cacheName, cacheOptions, cacheQueryOptions }) => {
  return async (request) => {
    if (!isHttpRequest(request)) {
      return new Response("Not a HTTP request", { status: 403 });
    }
    let remixCache;
    if (typeof cacheName === "string") {
      remixCache = Storage.open(cacheName, cacheOptions);
    } else {
      remixCache = cacheName;
    }
    const response = await remixCache.match(request, cacheQueryOptions);
    if (!response) {
      const req = request instanceof Request ? request : new Request(request.toString());
      const isGet = req.method.toLowerCase() === "get";
      return new Response(JSON.stringify({
        message: isGet ? "Not Found" : "No idea what you are trying to accomplish but this ain't it!"
      }), {
        status: isGet ? 404 : 400,
        statusText: isGet ? "Not Found" : "Bad Request"
      });
    }
    return response.clone();
  };
};

// ../packages/strategy/dist/src/networkFirst.js
var networkFirst = ({ cache: cacheName, cacheOptions, cacheQueryOptions, fetchDidFail = void 0, fetchDidSucceed = void 0, networkTimeoutSeconds = 10 }) => {
  return async (request) => {
    if (!isHttpRequest(request)) {
      return new Response("Not a HTTP request", { status: 403 });
    }
    let remixCache;
    if (typeof cacheName === "string") {
      remixCache = Storage.open(cacheName, cacheOptions);
    } else {
      remixCache = cacheName;
    }
    try {
      const timeoutPromise = networkTimeoutSeconds !== Infinity ? new Promise((_resolve, reject) => {
        setTimeout(() => {
          reject(new Error(`Network timed out after ${networkTimeoutSeconds} seconds`));
        }, networkTimeoutSeconds * 1e3);
      }) : null;
      const response = timeoutPromise ? await Promise.race([fetch(request), timeoutPromise]) : await fetch(request);
      if (response) {
        if (fetchDidSucceed) {
          await Promise.all(fetchDidSucceed.map((cb) => cb()));
        }
        await remixCache.put(request, response.clone());
        return response.clone();
      }
    } catch (error) {
      if (fetchDidFail) {
        await Promise.all(fetchDidFail.map((cb) => cb()));
      }
      const cachedResponse = await remixCache.match(request, cacheQueryOptions);
      if (cachedResponse) {
        return cachedResponse.clone();
      }
      return new Response(JSON.stringify({ message: "Network Error" }), {
        status: 500
      });
    }
    throw new Error("Failed to fetch. Network timed out.");
  };
};

// ../packages/strategy/dist/src/staleWhileRevalidate.js
var staleWhileRevalidate = ({ cache: cacheName, cacheOptions, cacheQueryOptions, fetchDidFail = void 0, strict = false, swr: swr2 }) => {
  return async (request) => {
    if (!isHttpRequest(request)) {
      return new Response("Not a HTTP request", { status: 403 });
    }
    let remixCache;
    if (typeof cacheName === "string") {
      remixCache = Storage.open(cacheName, cacheOptions);
    } else {
      remixCache = cacheName;
    }
    swr2 = swr2 ?? remixCache.ttl ?? 0;
    return remixCache.match(request, cacheQueryOptions).then(async (response) => {
      const res = response ? response.clone() : void 0;
      if (res && !strict) {
        const accessed = Number(res.headers.get("X-Remix-PWA-AccessTime")) ?? 0;
        if (swr2 + accessed >= Date.now()) {
          return res;
        }
      }
      const fetchPromise = fetch(request).then(async (networkResponse) => {
        await remixCache.put(request, networkResponse.clone(), strict ? swr2 : void 0);
        return networkResponse;
      }).catch(async (_err) => {
        if (fetchDidFail) {
          await Promise.all(fetchDidFail.map((cb) => cb()));
        }
        return new Response(JSON.stringify({ error: "Network request failed" }), {
          status: 500,
          statusText: "Network request failed"
        });
      });
      return response ? response.clone() : fetchPromise;
    });
  };
};

// routes-module:routes/basic-caching.tsx?worker
var workerLoader = async ({ context }) => {
  const customStrategy = cacheFirst({
    cache: "basic-caching",
    cacheQueryOptions: {
      ignoreSearch: true
    },
    cacheOptions: {
      maxItems: 5,
      ttl: 30 * 1e3
      // 30 seconds time-to-live (maxAge)
    },
    fetchDidFail: [
      () => console.log("Fetch failed!")
    ]
  });
  let response = await customStrategy(context.event.request);
  await customStrategy(new Request("https://images.unsplash.com/photo-1695570804246-a9470af7e197?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2903&q=80"));
  let data = await toJSON(response);
  const date = /* @__PURE__ */ new Date();
  return new Response(JSON.stringify({
    data: data.data,
    // Only this shows an updated time, the other one doesn't because it's cached.
    // Try deleting the cache and reloading the page to see the difference.
    message: `Server already up and running! Time: ${date.getMinutes()}:${date.getSeconds()}`
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

// routes-module:routes/basic-action.tsx?worker
var basic_action_exports = {};
__export(basic_action_exports, {
  workerAction: () => workerAction
});
var workerAction = async ({ context }) => {
  const { fetchFromServer } = context;
  console.log("Worker action called");
  try {
    const response = await fetchFromServer();
    console.log(Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.error(error);
  }
  return new Response(JSON.stringify({
    message: "Modified action response, Remix Actions are quite out of the picture here"
  }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
};

// routes-module:routes/basic-loader.tsx?worker
var basic_loader_exports = {};
__export(basic_loader_exports, {
  workerLoader: () => workerLoader2
});
async function workerLoader2({ context }) {
  const { fetchFromServer } = context;
  const message = await Promise.race([
    fetchFromServer().then((response) => response.json()).then(({ message: message2 }) => message2),
    new Promise((resolve) => setTimeout(resolve, 500, "Hello World!\n\n\u2022 This message is sent to you from the client \u{1F61C}!"))
  ]);
  return new Response(
    JSON.stringify({
      message
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}

// routes-module:routes/_app.flights.tsx?worker
var app_flights_exports = {};
__export(app_flights_exports, {
  workerAction: () => workerAction2,
  workerLoader: () => workerLoader3
});
init_router();
init_router();
init_router();
var workerAction2 = async ({ request, context }) => {
  const formData = await request.formData();
  const { database, fetchFromServer } = context;
  try {
    fetchFromServer();
    await database.selections.add(Object.fromEntries(formData.entries()));
    return redirect("/selection");
  } catch (error) {
    throw json({ message: "Something went wrong", error }, 500);
  }
};
var workerLoader3 = async ({ context }) => {
  try {
    const { fetchFromServer, database } = context;
    const [serverResult, clientResult] = await Promise.allSettled([
      // NOTE: If the user decides to use the server loader, must use the `context.event.request` object instead of `request`.
      // This is because we strip the `_data` and `index` from the request object just to follow what Remix does.
      fetchFromServer().then((response) => response.json()).then(({ flights: flights2 }) => flights2),
      database.flights.toArray()
    ]);
    const flights = serverResult.value || clientResult.value;
    if (serverResult.value) {
      await database.flights.bulkPut(
        flights.map((f2) => ({
          ...f2,
          flightNumber: `${f2.flightNumber.split("-")[0].trim()} - client`
        }))
      );
    }
    return defer({ flights });
  } catch (error) {
    console.error(error);
    throw json({ message: "Something went wrong", error }, 500);
  }
};

// routes-module:routes/strategies.tsx?worker
var strategies_exports = {};
__export(strategies_exports, {
  workerAction: () => workerAction3
});
var workerAction3 = async ({ context }) => {
  const { event } = context;
  const formData = await event.request.clone().formData();
  const strategy = formData.get("strategy");
  let customStrategy = void 0;
  switch (strategy) {
    case "cache-only":
      customStrategy = await cacheOnly({
        cache: "strategies-cache-only"
      });
      break;
    case "cache-first":
      customStrategy = await cacheFirst({
        cache: "strategies-cache-first"
      });
      break;
    case "network-first":
      customStrategy = await networkFirst({
        cache: "strategies-network-first"
      });
      break;
    case "swr":
      customStrategy = await staleWhileRevalidate({
        cache: "strategies-swr"
      });
      break;
    default:
      break;
  }
  return null;
};

// routes-module:routes/selection.tsx?worker
var selection_exports = {};
__export(selection_exports, {
  workerLoader: () => workerLoader4
});
init_router();
async function workerLoader4({ context }) {
  const { database } = context;
  const selections = await database.selections.toArray();
  return json({ selections });
}

// routes-module:routes/sync-away.tsx?worker
var sync_away_exports = {};
__export(sync_away_exports, {
  workerAction: () => workerAction4
});
var workerAction4 = async ({ context }) => {
  const { fetchFromServer, event } = context;
  try {
    await fetchFromServer();
  } catch (error) {
    console.error(error);
    queueToServer({
      name: "offline-action",
      request: event.request.clone()
    });
  }
  return new Response(JSON.stringify({
    message: "Offline or Online. I shall always respond!"
  }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });
};

// entry-module:@remix-pwa/build/magic
var route8 = __toESM(require_index());

// routes-module:routes/_app.tsx?worker
var app_exports = {};
__export(app_exports, {
  workerLoader: () => workerLoader5
});
async function workerLoader5({ context }) {
  const { fetchFromServer } = context;
  const data = await fetchFromServer().then((response) => response.json());
  console.log(data);
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

// assets-module:@remix-pwa/dev?assets
var assets = [];

// entry-module:@remix-pwa/build/magic
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/basic-caching": {
    id: "routes/basic-caching",
    parentId: "root",
    path: "basic-caching",
    index: void 0,
    caseSensitive: void 0,
    module: basic_caching_exports
  },
  "routes/basic-action": {
    id: "routes/basic-action",
    parentId: "root",
    path: "basic-action",
    index: void 0,
    caseSensitive: void 0,
    module: basic_action_exports
  },
  "routes/basic-loader": {
    id: "routes/basic-loader",
    parentId: "root",
    path: "basic-loader",
    index: void 0,
    caseSensitive: void 0,
    module: basic_loader_exports
  },
  "routes/_app.flights": {
    id: "routes/_app.flights",
    parentId: "routes/_app",
    path: "flights",
    index: void 0,
    caseSensitive: void 0,
    module: app_flights_exports
  },
  "routes/strategies": {
    id: "routes/strategies",
    parentId: "root",
    path: "strategies",
    index: void 0,
    caseSensitive: void 0,
    module: strategies_exports
  },
  "routes/selection": {
    id: "routes/selection",
    parentId: "root",
    path: "selection",
    index: void 0,
    caseSensitive: void 0,
    module: selection_exports
  },
  "routes/sync-away": {
    id: "routes/sync-away",
    parentId: "root",
    path: "sync-away",
    index: void 0,
    caseSensitive: void 0,
    module: sync_away_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route8
  },
  "routes/_app": {
    id: "routes/_app",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: app_exports
  }
};
var entry = { module: entry_worker_exports };

// ../packages/worker-runtime/dist/src/utils/handle-request.js
init_router();
var import_mode = __toESM(require_mode(), 1);
var import_responses2 = __toESM(require_responses(), 1);

// ../packages/worker-runtime/dist/src/utils/request.js
init_router();
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
    ...match?.params
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
function createArgumentsFrom({ event, loadContext, path }) {
  const request = stripDataParameter(stripIndexParameter(event.request.clone()));
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
function isActionRequest(request) {
  const url = new URL(request.url);
  return isMethod(request, ["post", "delete", "put", "patch"]) && url.searchParams.get("_data");
}
function isLoaderRequest(request) {
  const url = new URL(request.url);
  return isMethod(request, ["get"]) && url.searchParams.get("_data");
}

// ../packages/worker-runtime/dist/src/utils/response.js
var import_responses = __toESM(require_responses(), 1);
function errorResponseToJson(errorResponse) {
  return (0, import_responses.json)(errorResponse.error || { message: "Unexpected Server Error" }, {
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

// ../packages/worker-runtime/dist/src/utils/handle-request.js
async function handleRequest({ defaultHandler: defaultHandler2, errorHandler, event, loadContext, routes: routes2 }) {
  const url = new URL(event.request.url);
  const routeId = url.searchParams.get("_data");
  const route = routeId ? routes2[routeId] : void 0;
  const _arguments = {
    request: event.request,
    params: getURLParameters(event.request, route?.path),
    context: loadContext
  };
  try {
    if (isLoaderRequest(event.request) && route?.module.workerLoader) {
      return await handleLoader({
        event,
        loader: route.module.workerLoader,
        routeId: route.id,
        routePath: route.path,
        loadContext
      }).then(responseHandler);
    }
    if (isActionRequest(event.request) && route?.module?.workerAction) {
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
  if ((0, import_responses2.isDeferredData)(result)) {
    if (result.init && (0, import_responses2.isRedirectStatusCode)(result.init.status || 200)) {
      return (0, import_responses2.redirect)(new Headers(result.init.headers).get("Location"), result.init);
    }
    const body = (0, import_responses2.createDeferredReadableStream)(result, event.request.signal, import_mode.ServerMode.Production);
    const init = result.init || {};
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "text/remix-deferred");
    init.headers = headers;
    return new Response(body, init);
  }
  return (0, import_responses2.isResponse)(result) ? result : (0, import_responses2.json)(result);
}
async function handleAction({ action, event, loadContext, routeId, routePath }) {
  const _arguments = createArgumentsFrom({ event, loadContext, path: routePath });
  const result = await action(_arguments);
  if (result === void 0) {
    throw new Error(`You defined an action for route "${routeId}" but didn't return anything from your \`worker action\` function. Please return a value or \`null\`.`);
  }
  return (0, import_responses2.isResponse)(result) ? result : (0, import_responses2.json)(result);
}
function _errorHandler({ error, handler: handleError }) {
  if ((0, import_responses2.isResponse)(error)) {
    error.headers.set("X-Remix-Catch", "yes");
    return error;
  }
  if (isRouteErrorResponse(error)) {
    error.error && handleError(error.error);
    return errorResponseToJson(error);
  }
  const errorInstance = error instanceof Error ? error : new Error("Unexpected Server Error");
  handleError(errorInstance);
  return (0, import_responses2.json)({ message: errorInstance.message }, {
    status: 500,
    headers: {
      "X-Remix-Error": "yes"
    }
  });
}
function responseHandler(response) {
  if ((0, import_responses2.isRedirectResponse)(response)) {
    const headers = new Headers(response.headers);
    headers.set("X-Remix-Redirect", headers.get("Location"));
    headers.set("X-Remix-Status", String(response.status));
    headers.delete("Location");
    if (response.headers.get("Set-Cookie") !== null) {
      headers.set("X-Remix-Revalidate", "yes");
    }
    return new Response(null, {
      status: 204,
      headers
    });
  }
  !isRemixResponse(response) && response.headers.set("X-Remix-Response", "yes");
  return response;
}

// ../packages/worker-runtime/dist/src/service-worker.internal.js
var _self = self;
function createContext(event) {
  const context = entry.module.getLoadContext?.(event) || {};
  return {
    event,
    fetchFromServer: () => fetch(event.request.clone()),
    // NOTE: we want the user to override the above properties if needed.
    ...context
  };
}
var defaultHandler = entry.module.defaultFetchHandler || ((event) => fetch(event.request.clone()));
var defaultErrorHandler = entry.module.errorHandler || ((error, { request }) => {
  if (!request.signal.aborted) {
    console.error(error);
  }
});
_self.__workerManifest = {
  assets,
  routes
};
if (!_self.__messageHandlers || typeof _self.__messageHandlers === "undefined")
  _self.__messageHandlers = /* @__PURE__ */ new Map();
_self.addEventListener(
  "fetch",
  /**
   * The main fetch event listener callback.
   */
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
_self.addEventListener("message", (event) => {
  if (event.data && event.data.type) {
    const handler = _self.__messageHandlers.get(event.data.type);
    if (handler) {
      handler(event);
    }
  }
});
/*! Bundled license information:

@remix-run/router/dist/router.js:
  (**
   * @remix-run/router v1.14.2
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/server-runtime/dist/mode.js:
  (**
   * @remix-run/server-runtime v2.5.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/server-runtime/dist/errors.js:
  (**
   * @remix-run/server-runtime v2.5.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/server-runtime/dist/responses.js:
  (**
   * @remix-run/server-runtime v2.5.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)
*/

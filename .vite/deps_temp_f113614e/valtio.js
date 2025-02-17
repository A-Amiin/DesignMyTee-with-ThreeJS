import {
  require_react
} from "./chunk-32E4H3EV.js";
import {
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/proxy-compare/dist/index.js
var TRACK_MEMO_SYMBOL = Symbol();
var GET_ORIGINAL_SYMBOL = Symbol();
var AFFECTED_PROPERTY = "a";
var IS_TARGET_COPIED_PROPERTY = "f";
var PROXY_PROPERTY = "p";
var PROXY_CACHE_PROPERTY = "c";
var TARGET_CACHE_PROPERTY = "t";
var NEXT_OBJECT_PROPERTY = "n";
var CHANGED_PROPERTY = "g";
var HAS_KEY_PROPERTY = "h";
var ALL_OWN_KEYS_PROPERTY = "w";
var HAS_OWN_KEY_PROPERTY = "o";
var KEYS_PROPERTY = "k";
var newProxy = (target, handler) => new Proxy(target, handler);
var getProto = Object.getPrototypeOf;
var objectsToTrack = /* @__PURE__ */ new WeakMap();
var isObjectToTrack = (obj) => obj && (objectsToTrack.has(obj) ? objectsToTrack.get(obj) : getProto(obj) === Object.prototype || getProto(obj) === Array.prototype);
var isObject = (x) => typeof x === "object" && x !== null;
var needsToCopyTargetObject = (obj) => Object.values(Object.getOwnPropertyDescriptors(obj)).some((descriptor) => !descriptor.configurable && !descriptor.writable);
var copyTargetObject = (obj) => {
  if (Array.isArray(obj)) {
    return Array.from(obj);
  }
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  Object.values(descriptors).forEach((desc) => {
    desc.configurable = true;
  });
  return Object.create(getProto(obj), descriptors);
};
var createProxyHandler = (origObj, isTargetCopied) => {
  const state = {
    [IS_TARGET_COPIED_PROPERTY]: isTargetCopied
  };
  let trackObject = false;
  const recordUsage = (type, key) => {
    if (!trackObject) {
      let used = state[AFFECTED_PROPERTY].get(origObj);
      if (!used) {
        used = {};
        state[AFFECTED_PROPERTY].set(origObj, used);
      }
      if (type === ALL_OWN_KEYS_PROPERTY) {
        used[ALL_OWN_KEYS_PROPERTY] = true;
      } else {
        let set = used[type];
        if (!set) {
          set = /* @__PURE__ */ new Set();
          used[type] = set;
        }
        set.add(key);
      }
    }
  };
  const recordObjectAsUsed = () => {
    trackObject = true;
    state[AFFECTED_PROPERTY].delete(origObj);
  };
  const handler = {
    get(target, key) {
      if (key === GET_ORIGINAL_SYMBOL) {
        return origObj;
      }
      recordUsage(KEYS_PROPERTY, key);
      return createProxy(Reflect.get(target, key), state[AFFECTED_PROPERTY], state[PROXY_CACHE_PROPERTY], state[TARGET_CACHE_PROPERTY]);
    },
    has(target, key) {
      if (key === TRACK_MEMO_SYMBOL) {
        recordObjectAsUsed();
        return true;
      }
      recordUsage(HAS_KEY_PROPERTY, key);
      return Reflect.has(target, key);
    },
    getOwnPropertyDescriptor(target, key) {
      recordUsage(HAS_OWN_KEY_PROPERTY, key);
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
    ownKeys(target) {
      recordUsage(ALL_OWN_KEYS_PROPERTY);
      return Reflect.ownKeys(target);
    }
  };
  if (isTargetCopied) {
    handler.set = handler.deleteProperty = () => false;
  }
  return [handler, state];
};
var getOriginalObject = (obj) => (
  // unwrap proxy
  obj[GET_ORIGINAL_SYMBOL] || // otherwise
  obj
);
var createProxy = (obj, affected, proxyCache2, targetCache2) => {
  if (!isObjectToTrack(obj))
    return obj;
  let targetAndCopied = targetCache2 && targetCache2.get(obj);
  if (!targetAndCopied) {
    const target2 = getOriginalObject(obj);
    if (needsToCopyTargetObject(target2)) {
      targetAndCopied = [target2, copyTargetObject(target2)];
    } else {
      targetAndCopied = [target2];
    }
    targetCache2 === null || targetCache2 === void 0 ? void 0 : targetCache2.set(obj, targetAndCopied);
  }
  const [target, copiedTarget] = targetAndCopied;
  let handlerAndState = proxyCache2 && proxyCache2.get(target);
  if (!handlerAndState || handlerAndState[1][IS_TARGET_COPIED_PROPERTY] !== !!copiedTarget) {
    handlerAndState = createProxyHandler(target, !!copiedTarget);
    handlerAndState[1][PROXY_PROPERTY] = newProxy(copiedTarget || target, handlerAndState[0]);
    if (proxyCache2) {
      proxyCache2.set(target, handlerAndState);
    }
  }
  handlerAndState[1][AFFECTED_PROPERTY] = affected;
  handlerAndState[1][PROXY_CACHE_PROPERTY] = proxyCache2;
  handlerAndState[1][TARGET_CACHE_PROPERTY] = targetCache2;
  return handlerAndState[1][PROXY_PROPERTY];
};
var isAllOwnKeysChanged = (prevObj, nextObj) => {
  const prevKeys = Reflect.ownKeys(prevObj);
  const nextKeys = Reflect.ownKeys(nextObj);
  return prevKeys.length !== nextKeys.length || prevKeys.some((k, i) => k !== nextKeys[i]);
};
var isChanged = (prevObj, nextObj, affected, cache, isEqual = Object.is) => {
  if (isEqual(prevObj, nextObj)) {
    return false;
  }
  if (!isObject(prevObj) || !isObject(nextObj))
    return true;
  const used = affected.get(getOriginalObject(prevObj));
  if (!used)
    return true;
  if (cache) {
    const hit = cache.get(prevObj);
    if (hit && hit[NEXT_OBJECT_PROPERTY] === nextObj) {
      return hit[CHANGED_PROPERTY];
    }
    cache.set(prevObj, {
      [NEXT_OBJECT_PROPERTY]: nextObj,
      [CHANGED_PROPERTY]: false
    });
  }
  let changed = null;
  try {
    for (const key of used[HAS_KEY_PROPERTY] || []) {
      changed = Reflect.has(prevObj, key) !== Reflect.has(nextObj, key);
      if (changed)
        return changed;
    }
    if (used[ALL_OWN_KEYS_PROPERTY] === true) {
      changed = isAllOwnKeysChanged(prevObj, nextObj);
      if (changed)
        return changed;
    } else {
      for (const key of used[HAS_OWN_KEY_PROPERTY] || []) {
        const hasPrev = !!Reflect.getOwnPropertyDescriptor(prevObj, key);
        const hasNext = !!Reflect.getOwnPropertyDescriptor(nextObj, key);
        changed = hasPrev !== hasNext;
        if (changed)
          return changed;
      }
    }
    for (const key of used[KEYS_PROPERTY] || []) {
      changed = isChanged(prevObj[key], nextObj[key], affected, cache, isEqual);
      if (changed)
        return changed;
    }
    if (changed === null)
      changed = true;
    return changed;
  } finally {
    if (cache) {
      cache.set(prevObj, {
        [NEXT_OBJECT_PROPERTY]: nextObj,
        [CHANGED_PROPERTY]: changed
      });
    }
  }
};
var getUntracked = (obj) => {
  if (isObjectToTrack(obj)) {
    return obj[GET_ORIGINAL_SYMBOL] || null;
  }
  return null;
};
var markToTrack = (obj, mark = true) => {
  objectsToTrack.set(obj, mark);
};
var affectedToPathList = (obj, affected, onlyWithValues) => {
  const list = [];
  const seen = /* @__PURE__ */ new WeakSet();
  const walk = (x, path) => {
    var _a, _b, _c;
    if (seen.has(x)) {
      return;
    }
    if (isObject(x)) {
      seen.add(x);
    }
    const used = isObject(x) && affected.get(getOriginalObject(x));
    if (used) {
      (_a = used[HAS_KEY_PROPERTY]) === null || _a === void 0 ? void 0 : _a.forEach((key) => {
        const segment = `:has(${String(key)})`;
        list.push(path ? [...path, segment] : [segment]);
      });
      if (used[ALL_OWN_KEYS_PROPERTY] === true) {
        const segment = ":ownKeys";
        list.push(path ? [...path, segment] : [segment]);
      } else {
        (_b = used[HAS_OWN_KEY_PROPERTY]) === null || _b === void 0 ? void 0 : _b.forEach((key) => {
          const segment = `:hasOwn(${String(key)})`;
          list.push(path ? [...path, segment] : [segment]);
        });
      }
      (_c = used[KEYS_PROPERTY]) === null || _c === void 0 ? void 0 : _c.forEach((key) => {
        if (!onlyWithValues || "value" in (Object.getOwnPropertyDescriptor(x, key) || {})) {
          walk(x[key], path ? [...path, key] : [key]);
        }
      });
    } else if (path) {
      list.push(path);
    }
  };
  walk(obj);
  return list;
};

// node_modules/valtio/esm/vanilla.mjs
var isObject2 = (x) => typeof x === "object" && x !== null;
var canProxyDefault = (x) => isObject2(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer) && !(x instanceof Promise);
var createSnapshotDefault = (target, version) => {
  const cache = snapCache.get(target);
  if ((cache == null ? void 0 : cache[0]) === version) {
    return cache[1];
  }
  const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
  markToTrack(snap, true);
  snapCache.set(target, [version, snap]);
  Reflect.ownKeys(target).forEach((key) => {
    if (Object.getOwnPropertyDescriptor(snap, key)) {
      return;
    }
    const value = Reflect.get(target, key);
    const { enumerable } = Reflect.getOwnPropertyDescriptor(
      target,
      key
    );
    const desc = {
      value,
      enumerable,
      // This is intentional to avoid copying with proxy-compare.
      // It's still non-writable, so it avoids assigning a value.
      configurable: true
    };
    if (refSet.has(value)) {
      markToTrack(value, false);
    } else if (proxyStateMap.has(value)) {
      const [target2, ensureVersion] = proxyStateMap.get(
        value
      );
      desc.value = createSnapshot(target2, ensureVersion());
    }
    Object.defineProperty(snap, key, desc);
  });
  return Object.preventExtensions(snap);
};
var createHandlerDefault = (isInitializing, addPropListener, removePropListener, notifyUpdate) => ({
  deleteProperty(target, prop) {
    const prevValue = Reflect.get(target, prop);
    removePropListener(prop);
    const deleted = Reflect.deleteProperty(target, prop);
    if (deleted) {
      notifyUpdate(["delete", [prop], prevValue]);
    }
    return deleted;
  },
  set(target, prop, value, receiver) {
    const hasPrevValue = !isInitializing() && Reflect.has(target, prop);
    const prevValue = Reflect.get(target, prop, receiver);
    if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
      return true;
    }
    removePropListener(prop);
    if (isObject2(value)) {
      value = getUntracked(value) || value;
    }
    const nextValue = !proxyStateMap.has(value) && canProxy(value) ? proxy(value) : value;
    addPropListener(prop, nextValue);
    Reflect.set(target, prop, nextValue, receiver);
    notifyUpdate(["set", [prop], value, prevValue]);
    return true;
  }
});
var proxyStateMap = /* @__PURE__ */ new WeakMap();
var refSet = /* @__PURE__ */ new WeakSet();
var snapCache = /* @__PURE__ */ new WeakMap();
var versionHolder = [1, 1];
var proxyCache = /* @__PURE__ */ new WeakMap();
var objectIs = Object.is;
var newProxy2 = (target, handler) => new Proxy(target, handler);
var canProxy = canProxyDefault;
var createSnapshot = createSnapshotDefault;
var createHandler = createHandlerDefault;
function proxy(baseObject = {}) {
  if (!isObject2(baseObject)) {
    throw new Error("object required");
  }
  const found = proxyCache.get(baseObject);
  if (found) {
    return found;
  }
  let version = versionHolder[0];
  const listeners = /* @__PURE__ */ new Set();
  const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach((listener) => listener(op, nextVersion));
    }
  };
  let checkVersion = versionHolder[1];
  const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
    if (checkVersion !== nextCheckVersion && !listeners.size) {
      checkVersion = nextCheckVersion;
      propProxyStates.forEach(([propProxyState]) => {
        const propVersion = propProxyState[1](nextCheckVersion);
        if (propVersion > version) {
          version = propVersion;
        }
      });
    }
    return version;
  };
  const createPropListener = (prop) => (op, nextVersion) => {
    const newOp = [...op];
    newOp[1] = [prop, ...newOp[1]];
    notifyUpdate(newOp, nextVersion);
  };
  const propProxyStates = /* @__PURE__ */ new Map();
  const addPropListener = (prop, propValue) => {
    const propProxyState = !refSet.has(propValue) && proxyStateMap.get(propValue);
    if (propProxyState) {
      if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && propProxyStates.has(prop)) {
        throw new Error("prop listener already exists");
      }
      if (listeners.size) {
        const remove = propProxyState[2](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      } else {
        propProxyStates.set(prop, [propProxyState]);
      }
    }
  };
  const removePropListener = (prop) => {
    var _a;
    const entry = propProxyStates.get(prop);
    if (entry) {
      propProxyStates.delete(prop);
      (_a = entry[1]) == null ? void 0 : _a.call(entry);
    }
  };
  const addListener = (listener) => {
    listeners.add(listener);
    if (listeners.size === 1) {
      propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
        if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && prevRemove) {
          throw new Error("remove already exists");
        }
        const remove = propProxyState[2](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      });
    }
    const removeListener = () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        propProxyStates.forEach(([propProxyState, remove], prop) => {
          if (remove) {
            remove();
            propProxyStates.set(prop, [propProxyState]);
          }
        });
      }
    };
    return removeListener;
  };
  let initializing = true;
  const handler = createHandler(
    () => initializing,
    addPropListener,
    removePropListener,
    notifyUpdate
  );
  const proxyObject = newProxy2(baseObject, handler);
  proxyCache.set(baseObject, proxyObject);
  const proxyState = [baseObject, ensureVersion, addListener];
  proxyStateMap.set(proxyObject, proxyState);
  Reflect.ownKeys(baseObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(
      baseObject,
      key
    );
    if ("value" in desc && desc.writable) {
      proxyObject[key] = baseObject[key];
    }
  });
  initializing = false;
  return proxyObject;
}
function getVersion(proxyObject) {
  const proxyState = proxyStateMap.get(proxyObject);
  return proxyState == null ? void 0 : proxyState[1]();
}
function subscribe(proxyObject, callback, notifyInSync) {
  const proxyState = proxyStateMap.get(proxyObject);
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && !proxyState) {
    console.warn("Please use proxy object");
  }
  let promise;
  const ops = [];
  const addListener = proxyState[2];
  let isListenerActive = false;
  const listener = (op) => {
    ops.push(op);
    if (notifyInSync) {
      callback(ops.splice(0));
      return;
    }
    if (!promise) {
      promise = Promise.resolve().then(() => {
        promise = void 0;
        if (isListenerActive) {
          callback(ops.splice(0));
        }
      });
    }
  };
  const removeListener = addListener(listener);
  isListenerActive = true;
  return () => {
    isListenerActive = false;
    removeListener();
  };
}
function snapshot(proxyObject) {
  const proxyState = proxyStateMap.get(proxyObject);
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && !proxyState) {
    console.warn("Please use proxy object");
  }
  const [target, ensureVersion] = proxyState;
  return createSnapshot(target, ensureVersion());
}
function ref(obj) {
  refSet.add(obj);
  return obj;
}
var unstable_getInternalStates = () => ({
  proxyStateMap,
  refSet,
  snapCache,
  versionHolder,
  proxyCache
});
function unstable_replaceInternalFunction(name, fn) {
  switch (name) {
    case "objectIs":
      objectIs = fn(objectIs);
      break;
    case "newProxy":
      newProxy2 = fn(newProxy2);
      break;
    case "canProxy":
      canProxy = fn(canProxy);
      break;
    case "createSnapshot":
      createSnapshot = fn(createSnapshot);
      break;
    case "createHandler":
      createHandler = fn(createHandler);
      break;
    default:
      throw new Error("unknown function");
  }
}

// node_modules/valtio/esm/react.mjs
var import_react = __toESM(require_react(), 1);
var useAffectedDebugValue = (state, affected) => {
  const pathList = (0, import_react.useRef)();
  (0, import_react.useEffect)(() => {
    pathList.current = affectedToPathList(state, affected, true);
  });
  (0, import_react.useDebugValue)(pathList.current);
};
var condUseAffectedDebugValue = useAffectedDebugValue;
var targetCache = /* @__PURE__ */ new WeakMap();
function useSnapshot(proxyObject, options) {
  const notifyInSync = options == null ? void 0 : options.sync;
  const affected = (0, import_react.useMemo)(
    () => proxyObject && /* @__PURE__ */ new WeakMap(),
    [proxyObject]
  );
  const lastSnapshot = (0, import_react.useRef)();
  let inRender = true;
  const currSnapshot = (0, import_react.useSyncExternalStore)(
    (0, import_react.useCallback)(
      (callback) => {
        const unsub = subscribe(proxyObject, callback, notifyInSync);
        callback();
        return unsub;
      },
      [proxyObject, notifyInSync]
    ),
    () => {
      const nextSnapshot = snapshot(proxyObject);
      try {
        if (!inRender && lastSnapshot.current && !isChanged(
          lastSnapshot.current,
          nextSnapshot,
          affected,
          /* @__PURE__ */ new WeakMap()
        )) {
          return lastSnapshot.current;
        }
      } catch (e) {
      }
      return nextSnapshot;
    },
    () => snapshot(proxyObject)
  );
  inRender = false;
  (0, import_react.useLayoutEffect)(() => {
    lastSnapshot.current = currSnapshot;
  });
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production") {
    condUseAffectedDebugValue(currSnapshot, affected);
  }
  const proxyCache2 = (0, import_react.useMemo)(() => /* @__PURE__ */ new WeakMap(), []);
  return createProxy(currSnapshot, affected, proxyCache2, targetCache);
}
export {
  getVersion,
  proxy,
  ref,
  snapshot,
  subscribe,
  unstable_getInternalStates,
  unstable_replaceInternalFunction,
  useSnapshot
};
//# sourceMappingURL=valtio.js.map

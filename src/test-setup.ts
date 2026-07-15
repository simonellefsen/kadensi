// Node 22+ ships an experimental global `localStorage` accessor. Vitest's
// jsdom environment sees that `localStorage` already exists on globalThis and
// (reasonably, in general) leaves it alone rather than overriding a Node
// built-in — but Node's version throws without a --localstorage-file flag, so
// the global ends up non-functional. The real jsdom Storage implementation is
// still reachable via the jsdom instance Vitest stashes on globalThis.jsdom.
interface GlobalWithJsdomInstance {
  jsdom?: { window: { localStorage: Storage; sessionStorage: Storage } }
}

const jsdomInstance = (globalThis as GlobalWithJsdomInstance).jsdom
if (jsdomInstance) {
  Object.defineProperty(globalThis, 'localStorage', {
    value: jsdomInstance.window.localStorage,
    configurable: true,
  })
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: jsdomInstance.window.sessionStorage,
    configurable: true,
  })
}

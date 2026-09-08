import { config } from "@vue/test-utils";
import { vi } from "vitest";

global.ResizeObserver = global.ResizeObserver || class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (typeof globalThis.scrollTo !== "function") {
  globalThis.scrollTo = () => {};
}

class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store.hasOwnProperty(key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

if (!globalThis.localStorage) {
  Object.defineProperty(globalThis, "localStorage", {
    value: new LocalStorageMock(),
    writable: true,
    configurable: true,
  });
}

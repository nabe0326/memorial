// テスト環境のセットアップファイル
import '@testing-library/jest-dom'

// LocalStorage のモック
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// SessionStorage のモック  
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// window.matchMedia のモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// IntersectionObserver のモック
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// ResizeObserver のモック
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Notification API のモック
global.Notification = class Notification {
  constructor(title, options) {
    this.title = title
    this.options = options
  }
  
  static permission = 'default'
  
  static requestPermission = jest.fn(() => Promise.resolve('granted'))
  
  close = jest.fn()
}

// Service Worker のモック
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(() => Promise.resolve({
      addEventListener: jest.fn(),
      waiting: null,
      installing: null,
    })),
    ready: Promise.resolve({
      addEventListener: jest.fn(),
    }),
  },
  writable: true,
})
import { useState, useEffect, useCallback } from 'react'

/**
 * ローカルストレージと同期するカスタムフック（安定版）
 * @param {string} key - ローカルストレージのキー
 * @param {any} initialValue - 初期値
 * @returns {[any, function, function]} [値, セッター, 削除関数]
 */
export function useLocalStorage(key, initialValue) {
  // 初期値を遅延実行で取得
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // 値を設定する関数（依存配列なしで安定化）
  const setValue = useCallback((value) => {
    setStoredValue(currentValue => {
      try {
        // 関数が渡された場合は現在の値を使って実行
        const valueToStore = typeof value === 'function' ? value(currentValue) : value
        
        // ローカルストレージに保存
        if (typeof window !== 'undefined') {
          if (valueToStore === undefined || valueToStore === null) {
            window.localStorage.removeItem(key)
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          }
        }
        
        return valueToStore
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
        return currentValue
      }
    })
  }, [key])

  // 値を削除する関数
  const removeValue = useCallback(() => {
    setStoredValue(() => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key)
        }
        return initialValue
      } catch (error) {
        console.warn(`Error removing localStorage key "${key}":`, error)
        return initialValue
      }
    })
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * セッションストレージと同期するカスタムフック（安定版）
 */
export function useSessionStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    setStoredValue(currentValue => {
      try {
        const valueToStore = typeof value === 'function' ? value(currentValue) : value
        
        if (typeof window !== 'undefined') {
          if (valueToStore === undefined || valueToStore === null) {
            window.sessionStorage.removeItem(key)
          } else {
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
          }
        }
        
        return valueToStore
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error)
        return currentValue
      }
    })
  }, [key])

  const removeValue = useCallback(() => {
    setStoredValue(() => {
      try {
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem(key)
        }
        return initialValue
      } catch (error) {
        console.warn(`Error removing sessionStorage key "${key}":`, error)
        return initialValue
      }
    })
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * 複数のローカルストレージキーをまとめて管理するフック
 */
export function useMultipleLocalStorage(initialValues) {
  const [values, setValues] = useState(() => {
    const storedValues = {}
    
    Object.keys(initialValues).forEach(key => {
      try {
        if (typeof window !== 'undefined') {
          const item = window.localStorage.getItem(key)
          storedValues[key] = item ? JSON.parse(item) : initialValues[key]
        } else {
          storedValues[key] = initialValues[key]
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error)
        storedValues[key] = initialValues[key]
      }
    })

    return storedValues
  })

  const updateValue = useCallback((key, value) => {
    setValues(prev => {
      const valueToStore = typeof value === 'function' ? value(prev[key]) : value
      const newValues = { ...prev, [key]: valueToStore }

      // ローカルストレージに保存
      try {
        if (typeof window !== 'undefined') {
          if (valueToStore === undefined || valueToStore === null) {
            window.localStorage.removeItem(key)
          } else {
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
          }
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }

      return newValues
    })
  }, [])

  const resetAll = useCallback(() => {
    setValues(initialValues)
    
    Object.keys(initialValues).forEach(key => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key)
        }
      } catch (error) {
        console.warn(`Error removing localStorage key "${key}":`, error)
      }
    })
  }, [initialValues])

  return [values, updateValue, resetAll]
}

/**
 * ローカルストレージの使用可能性をチェックするフック
 */
export function useLocalStorageAvailable() {
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const testKey = '__localStorage_test__'
        window.localStorage.setItem(testKey, 'test')
        window.localStorage.removeItem(testKey)
        setIsAvailable(true)
      }
    } catch {
      setIsAvailable(false)
    }
  }, [])

  return isAvailable
}
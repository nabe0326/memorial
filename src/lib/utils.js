// 共通ユーティリティ関数

/**
 * クラス名を条件付きで結合する
 * @param {...string} classes - クラス名
 * @returns {string} 結合されたクラス名
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/**
 * 文字列を指定した長さで切り詰める
 * @param {string} str - 対象の文字列
 * @param {number} length - 最大長さ
 * @param {string} suffix - 切り詰め時のサフィックス
 * @returns {string} 切り詰められた文字列
 */
export function truncate(str, length = 100, suffix = '...') {
  if (!str || str.length <= length) return str
  return str.substring(0, length) + suffix
}

/**
 * 文字列が空かどうかを判定する
 * @param {string} str - 判定対象の文字列
 * @returns {boolean} 空の場合true
 */
export function isEmpty(str) {
  return !str || str.trim().length === 0
}

/**
 * オブジェクトから空の値を除去する
 * @param {object} obj - 対象のオブジェクト
 * @returns {object} 空の値が除去されたオブジェクト
 */
export function removeEmpty(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value
    }
    return acc
  }, {})
}

/**
 * 配列をランダムにシャッフルする
 * @param {Array} array - 対象の配列
 * @returns {Array} シャッフルされた新しい配列
 */
export function shuffle(array) {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * 配列から重複を除去する
 * @param {Array} array - 対象の配列
 * @param {string|function} key - 比較キー（文字列の場合はプロパティ名、関数の場合は比較関数）
 * @returns {Array} 重複が除去された新しい配列
 */
export function unique(array, key = null) {
  if (!key) {
    return [...new Set(array)]
  }
  
  if (typeof key === 'string') {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  }
  
  if (typeof key === 'function') {
    const seen = new Set()
    return array.filter(item => {
      const value = key(item)
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
  }
  
  return array
}

/**
 * オブジェクトのディープコピーを作成する
 * @param {any} obj - コピー対象
 * @returns {any} ディープコピーされたオブジェクト
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

/**
 * 指定した時間だけ処理を遅延する
 * @param {number} ms - 遅延時間（ミリ秒）
 * @returns {Promise} 遅延Promise
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 関数の実行頻度を制限する（デバウンス）
 * @param {function} func - 実行する関数
 * @param {number} delay - 遅延時間（ミリ秒）
 * @returns {function} デバウンスされた関数
 */
export function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * 関数の実行頻度を制限する（スロットル）
 * @param {function} func - 実行する関数
 * @param {number} delay - 制限時間（ミリ秒）
 * @returns {function} スロットルされた関数
 */
export function throttle(func, delay) {
  let lastCall = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      return func.apply(this, args)
    }
  }
}

/**
 * URLからクエリパラメータを取得する
 * @param {string} url - 対象のURL（省略時は現在のURL）
 * @returns {object} クエリパラメータのオブジェクト
 */
export function getQueryParams(url = window.location.href) {
  const urlObj = new URL(url)
  const params = {}
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}

/**
 * 数値を指定した桁数でゼロパディングする
 * @param {number} num - 対象の数値
 * @param {number} digits - 桁数
 * @returns {string} ゼロパディングされた文字列
 */
export function padZero(num, digits = 2) {
  return num.toString().padStart(digits, '0')
}

/**
 * バイト数を人間が読みやすい形式に変換する
 * @param {number} bytes - バイト数
 * @param {number} decimals - 小数点以下の桁数
 * @returns {string} フォーマットされた文字列
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 文字列をキャメルケースに変換する
 * @param {string} str - 対象の文字列
 * @returns {string} キャメルケースの文字列
 */
export function toCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

/**
 * 文字列をケバブケースに変換する
 * @param {string} str - 対象の文字列
 * @returns {string} ケバブケースの文字列
 */
export function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}
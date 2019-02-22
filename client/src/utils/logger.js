/* eslint-disable no-mixed-operators */

const logIt = (...args) => {
  // For server
  if (typeof window === 'undefined') {
    console.log(...args)
    return
  }

  // For client
  if (window.console && console.trace) {
    var oldTrace = console.trace
    console.trace = function (msg, css) {
      msg = msg && String(msg) || 'trace'
      if (!msg.startsWith('%c')) {
        msg = '%c' + msg
        css = 'font-weight: normal'
      } else {
        css = 'font-weight: normal ' + String(css || '')
      }
      console.groupCollapsed(msg, css)
      oldTrace.apply(this)
      console.groupEnd()
    }
  }

  console.trace()
  console.log(...args)
}

const logger = {
  info: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      logIt(...args)
    }
  },
  error: (...args) => {
    if (process.env.NODE_ENV !== 'production') {
      logIt(...args)
    }
  },
}

export default logger
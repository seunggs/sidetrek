/* eslint-disable no-mixed-operators */

const logger = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof window === 'undefined') {
      // For server
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

    console.log(...args)
    console.trace()
  }
}

export default logger
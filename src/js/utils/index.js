export function maybePlural (number, str) {
  return number > 1 ? `${str}s` : `${str}`
}

export function humanDuration (ms) {
  if (!ms) return ''

  if (ms >= 60 * 60 * 1000) {
    const hour = parseInt(ms / 3600000)
    return `${hour} ${maybePlural(hour, 'hour')}`
  } else if (ms >= 60000) {
    const min = parseInt(ms / 60000)
    return `${min} ${maybePlural(min, 'min')}`
  } else {
    return `${parseInt(ms / 1000)} ${maybePlural(ms / 1000, 'second')}`
  }
}

// callback: function to be executed
// interval: duration between each executions
// delay: delay time before first excution
export function interval (callback, interval, delay = 0) {
  if (interval < 10) interval = 10

  let initialTimer
  let intervalTimer

  initialTimer = setTimeout(() => {
    callback()
    intervalTimer = setInterval(callback, interval)
  }, delay)

  return () => {
    if (initialTimer) clearTimeout(initialTimer)
    if (intervalTimer) clearInterval(intervalTimer)
  }
}

export function hub () {
}

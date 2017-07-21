export function maybePlural (number, str) {
  return number > 1 ? `${str}s` : `${str}`
}

export function humanDuration (ms) {
  const s = parseInt(ms / 1000)
  if (s >= 60 * 60) {
    const hour = parseInt(s / 3600)
    return `${hour} ${maybePlural(hour, 'hour')}`
  } else if (s >= 60) {
    const min = parseInt(s / 60)
    return `${min} ${maybePlural(min, 'min')}`
  } else if (!s) {
    return `now`
  } else {
    return `${s} ${maybePlural(s, 'second')}`
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

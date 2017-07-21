export default class Hub {
  constructor () {
    this.queue = []
    this.unsubscribe = this.unsubscribe.bind(this)
  }

  subscribe (fn) {
    if (({}).toString.call(fn) !== '[object Function]') {
      throw new TypeError('must subscribe with a function')
    }

    this.queue.push(fn)

    return () => this.unsubscribe(fn)
  }

  publish () {
    this.queue.forEach((fn) => {
      fn.apply(null, arguments)
    })
  }

  unsubscribe (fn) {
    const index = this.queue.indexOf(fn)

    this.queue = [...this.queue.slice(0, index), ...this.queue.slice(index + 1)]
  }
}

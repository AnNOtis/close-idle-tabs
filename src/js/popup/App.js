/** @jsx h */
import { h, Component } from 'preact'
import Header from './Header'
import Main from './Main'
import { TAB_DATA_PORT } from '../background'

class App extends Component {
  constructor () {
    super()
    this.getData = this.getData.bind(this)
    this.markIdleTabs = this.markIdleTabs.bind(this)
    this.unmarkIdleTabs = this.unmarkIdleTabs.bind(this)
    this.cancelIdleTabs = this.cancelIdleTabs.bind(this)

    this.state = {
      currentTime: Date.now(),
      idleTabIDs: [],
      data: null
    }
  }

  componentDidMount () {
    this.setupDataChannel()
    this.setupClock()
  }

  componentWillUnmount () {
    this.cancelDataChannel()
    this.cancelClock()
  }

  render (_, {data, currentTime, idleTabIDs}) {
    if (!data) return <div>loading...</div>

    return (
      <div>
        <Header
          tabs={data.tabs}
          onEnterButton={this.markIdleTabs}
          onLeaveButton={this.unmarkIdleTabs}
          onClickButton={this.cancelIdleTabs}
        />
        <Main
          currentTime={currentTime}
          tabs={data.tabs}
          idleTabIDs={idleTabIDs}
        />
      </div>
    )
  }

  markIdleTabs (filter) {
    this.setState({ idleTabIDs: filter(this.state.data.tabs).map(t => t.id) })
  }

  unmarkIdleTabs () {
    this.setState({ idleTabIDs: [] })
  }

  cancelIdleTabs () {
    this.tabDataChannel.postMessage({
      what: 'closeIdleTabs',
      idleTabIDs: this.state.idleTabIDs
    })
  }

  getData () {
    this.tabDataChannel.postMessage({ what: 'data' })
  }

  setupDataChannel () {
    chrome.windows.getCurrent(win => {
      this.tabDataChannel = chrome.runtime.connect({
        name: `${TAB_DATA_PORT}#${win.id}`
      })
      this.tabDataChannel.onMessage.addListener(data => {
        this.setState({ data })
      })
    })
  }

  cancelDataChannel () {
    this.tabDataChannel.disconnect()
  }

  setupClock () {
    this._timer = setInterval(() => {
      const currentTime = Date.now()
      this.setState({ currentTime })
    }, 1000)
  }

  cancelClock () {
    clearInterval(this._timer)
  }
}

export default App

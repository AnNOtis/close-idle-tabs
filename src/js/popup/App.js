/** @jsx h */
import { h, Component } from 'preact'
import Header from './Header'
import Main from './Main'
import { TAB_DATA_PORT } from '../background'

class App extends Component {
  constructor () {
    super()
    this.getData = this.getData.bind(this)
    this.removeIdleTabs = this.removeIdleTabs.bind(this)
    this.setIdleTabs = this.setIdleTabs.bind(this)
    this.idleTabsID = this.idleTabsID.bind(this)
    this.highlightIdleTabs = this.highlightIdleTabs.bind(this)
    this.cancelHighlightIdleTabs = this.cancelHighlightIdleTabs.bind(this)

    this.state = {
      currentTime: Date.now(),
      isHighlightingIdleTabs: false,
      idleTabsID: []
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

  render (_, {data, currentTime, idleTabsID, isHighlightingIdleTabs}) {
    if (!data) return <div>loading...</div>

    return (
      <div>
        <Header
          tabs={data.tabs}
          idleTime={data.IDLE_TIME}
          idleTabsID={idleTabsID}
          onEnterButton={this.highlightIdleTabs}
          onLeaveButton={this.cancelHighlightIdleTabs}
          onClickButton={this.removeIdleTabs}
        />
        <Main
          currentTime={currentTime}
          tabs={data.tabs}
          isHighlightingIdleTabs={isHighlightingIdleTabs}
          idleTabsID={idleTabsID}
        />
      </div>
    )
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
      this.setState({ currentTime, idleTabsID: this.idleTabsID(currentTime) })
    }, 1000)
  }

  cancelClock () {
    clearInterval(this._timer)
  }

  setIdleTabs () {
    this.setState({ idleTabsID: this.idleTabsID() })
  }

  idleTabsID (now = null) {
    const data = this.state.data

    return data.tabs.filter(tab => {
      if (tab.active) return false
      if (tab.pinned) return false
      return ((now || this.state.currentTime) - tab.lastActivedAt) > data.IDLE_TIME
    })
    .map(tab => tab.id)
  }

  highlightIdleTabs () {
    this.setState({ isHighlightingIdleTabs: true })
  }

  cancelHighlightIdleTabs () {
    this.setState({ isHighlightingIdleTabs: false })
  }

  removeIdleTabs () {
    this.tabDataChannel.postMessage({ what: 'closeIdleTabs' })
  }
}

export default App

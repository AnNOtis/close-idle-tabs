import { h, Component } from 'preact'
import Header from './Header'
import Main from './Main'
import { TAB_DATA_PORT } from '../background'

class App extends Component {
  constructor () {
    super()
    this.getData = this.getData.bind(this)
    this.removeIdleTabs = this.removeIdleTabs.bind(this)
    this.highlightTabsWilllBeClosed = this.highlightTabsWilllBeClosed.bind(this)
    this.cancelTabsWilllBeClosed = this.cancelTabsWilllBeClosed.bind(this)
    this.state = {
      tabsWillBeClosed: []
    }
  }

  componentDidMount () {
    chrome.windows.getCurrent(win => {
      this.tabDataChannel = chrome.runtime.connect({
        name: `${TAB_DATA_PORT}#${win.id}`
      })
      this.tabDataChannel.onMessage.addListener(data => {
        this.setState({ data })
      })
    })
  }

  componentWillUnmount () {
    this.tabDataChannel.disconnect()
  }

  render (_, {data}) {
    if (!data) return <div>loading...</div>

    return (
      <div>
        <Header
          tabs={data.tabs}
          idleTime={data.IDLE_TIME}
          onEnterButton={this.highlightTabsWilllBeClosed}
          onLeaveButton={this.cancelTabsWilllBeClosed}
          onClickButton={this.removeIdleTabs}
        />
        <Main
          idleTime={data.IDLE_TIME}
          tabs={data.tabs}
          tabsWillBeClosed={this.state.tabsWillBeClosed}
        />
      </div>
    )
  }

  highlightTabsWilllBeClosed (tabsWillBeClosed = []) {
    this.setState({ tabsWillBeClosed: tabsWillBeClosed })
  }

  cancelTabsWilllBeClosed () {
    this.setState({ tabsWillBeClosed: [] })
  }

  removeIdleTabs () {
    this.tabDataChannel.postMessage({ what: 'closeIdleTabs' })

    // automatically close popup page
    setTimeout(() => window.close(), 1000)
  }

  getData () {
    this.tabDataChannel.postMessage({ what: 'data' })
  }
}

export default App

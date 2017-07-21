import { h, Component } from 'preact'
import Header from './Header'
import Main from './Main'
import { interval } from '../utils/index'
import { TAB_DATA_PORT } from '../background'

class App extends Component {
  constructor () {
    super()
    this.getData = this.getData.bind(this)
  }

  componentDidMount () {
    this.tabDataChannel = chrome.runtime.connect({name: TAB_DATA_PORT})
    this.tabDataChannel.onMessage.addListener(data => {
      this.setState({ data })
    })
    this._cancelFetchingData = interval(() => this.tabDataChannel.postMessage(), 2000)
  }

  componentWillUnmount () {
    this._cancelFetchingData()
    this.tabDataChannel.disconnect()
  }

  render (_, {data}) {
    if (!data) return <div>loading...</div>

    return (
      <div>
        <Header
          wantedTabs={data.wantedTabs}
          unwantedTabs={data.unwantedTabs}
          onRefetch={this.getData}
        />
        <Main
          idleTime={data.IDLE_TIME}
          unwantedTabs={data.unwantedTabs}
          wantedTabs={data.wantedTabs}
        />
      </div>
    )
  }

  getData () {
    this.tabDataChannel.postMessage()
  }
}

export default App

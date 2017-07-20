import { h, Component } from 'preact'
import Header from './Header'
import Main from './Main'

class App extends Component {
  constructor () {
    super()
    this.refetch = this.refetch.bind(this)
  }
  componentDidMount () {
    this.intervalfetchData()
  }

  componentWillUnmount () {
    this.clearFetchDataTimer()
  }

  render (_, {data}) {
    if (!data) return <div>loading...</div>

    return (
      <div>
        <Header
          wantedTabs={data.wantedTabs}
          unwantedTabs={data.unwantedTabs}
          onRefetch={this.refetch}
        />
        <Main
          idleTime={data.IDLE_TIME}
          unwantedTabs={data.unwantedTabs}
          wantedTabs={data.wantedTabs}
        />
      </div>
    )
  }

  intervalfetchData () {
    return this.fetchData()
      .then(data => {
        this.setState({ data })

        this._timer = setTimeout(() => {
          this.intervalfetchData()
        }, 2000)
      })
  }

  clearFetchDataTimer () {
    clearInterval(this._timer)
  }

  refetch() {
    return this.fetchData()
      .then(data => this.setState({ data }))
  }

  fetchData () {
    return chrome.extension.getBackgroundPage().getPopupPageData()
  }
}

export default App

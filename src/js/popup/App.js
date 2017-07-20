import { h, Component } from 'preact'
import Header from './Header'
import Main from './Main'

class App extends Component {
  componentDidMount () {
    this.intervalfetchData()
  }

  componentWillUnmount () {
    this.clearFetchDataTimer()
  }

  render (_, {data}) {
    return (
      !data
        ? <div>loading...</div>
        : <div>
          <Header wantedTabs={data.wantedTabs} />
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

  fetchData () {
    return chrome.extension.getBackgroundPage().getPopupPageData()
  }
}

export default App

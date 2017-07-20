import { h, Component } from 'preact'
import Header from './Header'
import Main from './Main'

class App extends Component {
  render ({data}) {
    return <div>
      <Header wantedTabs={data.wantedTabs} />
      <Main idleTime={data.IDLE_TIME} unwantedTabs={data.unwantedTabs}/>
    </div>
  }
}

export default App

import { h, Component } from 'preact'
import Header from './Header'
import Main from './Main'

class App extends Component {
  render ({data}) {
    return <div>
      <Header wantedTabs={data.wantedTabs} />
      <Main />
    </div>
  }
}

export default App

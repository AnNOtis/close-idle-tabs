import { h, Component } from 'preact'
import TabList from './TabList'

class Main extends Component {
  render ({idleTime, tabs}) {
    return (
      <div class='main'>
        <TabList tabs={tabs} />
      </div>
    )
  }
}

export default Main

import { h, Component } from 'preact'
import InactiveTabPreview from './InactiveTabPreview'

class Main extends Component {
  render ({idleTime, unwantedTabs}) {
    return (
      <div class='main'>
        <InactiveTabPreview idleTime={idleTime} unwantedTabs={unwantedTabs} />
      </div>
    )
  }
}

export default Main

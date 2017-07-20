import { h, Component } from 'preact'
import InactiveTabPreview from './InactiveTabPreview'
import ActiveTab from './ActiveTab'

class Main extends Component {
  render ({idleTime, unwantedTabs, wantedTabs}) {
    return (
      <div class='main'>
        <InactiveTabPreview idleTime={idleTime} unwantedTabs={unwantedTabs} />
        <ActiveTab wantedTabs={wantedTabs} />
      </div>
    )
  }
}

export default Main

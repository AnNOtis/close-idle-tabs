import { h, Component } from 'preact'
import ActiveTabList from './ActiveTabList'

class ActiveTab extends Component {
  render ({wantedTabs}) {
    return (
      <div>
        <div class='stateHeader'>Active Tabs ({wantedTabs.length})</div>
        <ActiveTabList tabs={wantedTabs} />
      </div>
    )
  }
}

export default ActiveTab

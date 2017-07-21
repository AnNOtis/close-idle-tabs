import { h, Component } from 'preact'
import { maybePlural, humanDuration } from '../utils/index'

class InactiveTabPreview extends Component {
  render ({ idleTime, unwantedTabs }) {
    const tabCount = unwantedTabs.length
    return (
      <div class='inactiveTabs'>
        <strong>{tabCount}</strong> {maybePlural(tabCount, 'tab')} are <strong>{humanDuration(idleTime)}</strong> idle.
      </div>
    )
  }
}

export default InactiveTabPreview

/** @jsx h */
import { h, Component } from 'preact'
import { maybePlural, humanDuration } from '../utils/index'
import { linkToOptions } from '../popup'

class InactiveTabPreview extends Component {
  render ({ idleTime, unwantedTabs }) {
    const tabCount = unwantedTabs.length
    return (
      <div class='inactiveTabs'>
        <strong>{tabCount}</strong> {maybePlural(tabCount, 'tab')} are <strong style={{cursor: 'pointer', textDecoration: 'underline'}} onClick={linkToOptions}>{humanDuration(idleTime)}</strong> idle.
      </div>
    )
  }
}

export default InactiveTabPreview

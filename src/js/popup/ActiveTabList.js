/** @jsx h */
import { h, Component } from 'preact'
import Tab from './Tab'

// <li key={tab.id} class='item'><Tab tab={tab} /></li>
class ActiveTabList extends Component {
  render () {
    return (
      <div class='activeTabs'>
        <ul class='list'>
          {this.sortedTabs().map(tab => (<li><Tab tab={tab} /></li>))}
        </ul>
      </div>
    )
  }

  sortedTabs () {
    return this.props.tabs.sort((a, b) => {
      if (a.pinned && b.pinned) return 0
      if (a.active && b.active) return 0
      if (a.pinned && !b.pinned) return -1
      if (b.pinned && !a.pinned) return 1
      if (a.active && !b.pinned) return -1
      if (b.active && !a.pinned) return 1
      return b.lastActivedAt - a.lastActivedAt
    })
  }
}

export default ActiveTabList

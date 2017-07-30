import { h, Component } from 'preact'
import Tab from './Tab'
import styled from 'styled-components'

const Ul = styled.ul`
  overflow: auto;
  background-color: #f4f7fc;
`

const Li = styled.li`
  &:not(:first-child) {
    margin-top: -1px
  }
`

class TabList extends Component {
  render ({ tabs, idleTabsID, isHighlightingIdleTabs, currentTime }) {
    return (
      <Ul>
        {this.sortedTabs().map(tab => (
          <Li>
            <Tab
              key={tab.id}
              tab={tab}
              currentTime={currentTime}
              showCloseIcon={
                isHighlightingIdleTabs && idleTabsID.indexOf(tab.id) !== -1
              }
            />
          </Li>
        ))}
      </Ul>
    )
  }

  sortedTabs () {
    const dupTabs = this.props.tabs.slice()
    const tabs = []
    const activeTabs = []
    const pinnedTabs = []

    dupTabs.forEach(tab => {
      if (tab.active) {
        activeTabs.push(tab)
      } else if (tab.pinned) {
        pinnedTabs.push(tab)
      } else {
        tabs.push(tab)
      }
    })

    return [].concat(activeTabs, pinnedTabs, tabs)
  }
}

export default TabList

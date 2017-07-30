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
  render ({ tabs, tabsWillBeClosed }) {
    return (
      <Ul>
        {this.sortedTabs().map(tab => (
          <Li><Tab tab={tab} willBeClosed={tabsWillBeClosed.indexOf(tab.id) !== -1} /></Li>
        ))}
      </Ul>
    )
  }

  sortedTabs () {
    // 最近活躍的 tab 排前面
    return this.props.tabs.sort((tabA, tabB) => {
      let a = tabA.lastActivedAt
      let b = tabB.lastActivedAt

      // 讓 pinned 與 active 的 tab 排在最前面
      if (tabA.active) {
        a = Number.POSITIVE_INFINITY
      } else if (tabA.pinned) {
        a = Number.POSITIVE_INFINITY - 1
      }
      if (tabB.active) {
        b = Number.POSITIVE_INFINITY
      } else if (tabB.pinned) {
        b = Number.POSITIVE_INFINITY - 1
      }

      return b - a
    })
  }


}

export default TabList

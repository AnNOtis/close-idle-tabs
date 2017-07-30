import { h, Component } from 'preact'
import styled from 'styled-components'
import TabList from './TabList'

const Wrapper = styled.div`
  margin-top: 100px;
`

class Main extends Component {
  render ({idleTime, tabs, tabsWillBeClosed}) {
    return (
      <Wrapper>
        <TabList tabs={tabs} tabsWillBeClosed={tabsWillBeClosed} />
      </Wrapper>
    )
  }
}

export default Main

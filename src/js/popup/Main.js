/** @jsx h */
import { h, Component } from 'preact'
import styled from 'styled-components'
import TabList from './TabList'

const Wrapper = styled.div`
  margin-top: 100px;
`

class Main extends Component {
  render ({tabs, idleTabIDs, currentTime}) {
    return (
      <Wrapper>
        <TabList
          currentTime={currentTime}
          tabs={tabs}
          idleTabIDs={idleTabIDs}
        />
      </Wrapper>
    )
  }
}

export default Main

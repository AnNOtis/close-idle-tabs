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
  render ({ tabs }) {
    return (
      <Ul>
        {tabs.map(tab => (<Li><Tab tab={tab} /></Li>))}
      </Ul>
    )
  }
}

export default TabList

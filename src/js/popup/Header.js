import { h, Component } from 'preact'
import { humanDuration } from '../utils/index'
import PrimaryButton from './buttons/PrimaryButton'
import styled from 'styled-components'
import v from 'css/variables'

const Wrapper = styled.div`
  margin: 12px;
`

const Strong = styled.div`
  font-size: ${props => props.size || '20'}px;
  line-height: 1.4em;
  font-weight: bolder;
  font-family: ${v.fontHeader};
`
const ButtonHint = styled.div`
  font-size: 12px;
  color: #555;
  text-align: center;
`

const Hint = styled.div`
  font-size: 12px;
  color: #777;
  text-align: center;
  margin: 14px 0 6px 0;
`

class Button extends Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  render (props) {
    return (
      <button class='btn' onClick={this.handleClick}>
        <ButtonHint>close the tabs idle for</ButtonHint>
        <Strong> {humanDuration(props.idleTime)}</Strong>
      </button>
    )
  }

  handleClick () {
    chrome.extension.getBackgroundPage().closeUnwantedTabs()
    this.props.onClick()
  }
}

class Header extends Component {
  render ({onRefetch, idleTime}) {
    return (
      <Wrapper>
        <Button onClick={onRefetch} idleTime={idleTime} />
        <Hint>close all tabs, but leave</Hint>
        <div style={{display: 'flex'}}>
          <PrimaryButton>
            <Strong size='14'>1 tabs</Strong>
          </PrimaryButton>
          <PrimaryButton>
            <Strong size='14'>2 tabs</Strong>
          </PrimaryButton>
          <PrimaryButton>
            <Strong size='14'>3 tabs</Strong>
          </PrimaryButton>
        </div>
      </Wrapper>
    )
  }
}

export default Header

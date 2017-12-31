/** @jsx h */
import { h, Component } from 'preact'
import { humanDuration } from '../utils/index'
import PrimaryButton from './buttons/PrimaryButton'
import styled from 'styled-components'
import v from 'css/variables'

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 12px;
  background-color: white;
  z-index: 9999;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,0.1);
`

const Strong = styled.div`
  font-size: 20px;
  line-height: 1.4em;
  font-weight: bolder;
  font-family: ${v.fontHeader};
`
const ButtonHint = styled.div`
  font-size: 12px;
  color: #555;
  text-align: center;
`

class Header extends Component {
  render ({idleTime, idleTabsID, onEnterButton, onLeaveButton, onClickButton}) {
    return (
      <Wrapper>
        <PrimaryButton
          onMouseOver={onEnterButton}
          onMouseLeave={onLeaveButton}
          onClick={onClickButton}
          disabled={idleTabsID.length === 0}
        >
          <ButtonHint>close tabs idle for</ButtonHint>
          <Strong>{humanDuration(idleTime)}</Strong>
        </PrimaryButton>
      </Wrapper>
    )
  }
}

export default Header

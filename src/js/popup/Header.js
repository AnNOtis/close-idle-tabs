/** @jsx h */
import { h, Component } from 'preact'
import styled from 'styled-components'
import generateCancelButton from './MissionButton/generateCancelButton'
import generateKeepButton from './MissionButton/generateKeepButton'
import Slider from './Slider'

const FIVE_MIN_MS = 5 * 60 * 1000
const FIFTEEN_MIN_MS = 15 * 60 * 1000
const THIRTY_MIN_MS = 30 * 60 * 1000

const FiveMinCancelButton = generateCancelButton(FIVE_MIN_MS)
const FifteenMinCancelButton = generateCancelButton(FIFTEEN_MIN_MS)
const ThirtyMinCancelButton = generateCancelButton(THIRTY_MIN_MS)
const KeepOneTabsButton = generateKeepButton(1)
const KeepThreeTabsButton = generateKeepButton(3)
const KeepFiveTabsButton = generateKeepButton(5)

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background-color: white;
  z-index: 9999;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,0.1);
`

const ButtonWrapper = styled.div`
  padding: 10px;
`

class Header extends Component {
  render ({tabs, onEnterButton, onLeaveButton, onClickButton}) {
    return (
      <Wrapper>
        <Slider>
          <ButtonWrapper><KeepOneTabsButton
            onMouseOver={onEnterButton}
            onMouseLeave={onLeaveButton}
            onClick={onClickButton}
            disabled={false}
          /></ButtonWrapper>
          <ButtonWrapper><KeepThreeTabsButton
            onMouseOver={onEnterButton}
            onMouseLeave={onLeaveButton}
            onClick={onClickButton}
            disabled={false}
          /></ButtonWrapper>
          <ButtonWrapper><KeepFiveTabsButton
            onMouseOver={onEnterButton}
            onMouseLeave={onLeaveButton}
            onClick={onClickButton}
            disabled={false}
          /></ButtonWrapper>
          <ButtonWrapper><FiveMinCancelButton
            onMouseOver={onEnterButton}
            onMouseLeave={onLeaveButton}
            onClick={onClickButton}
            disabled={false}
          /></ButtonWrapper>
          <ButtonWrapper><FifteenMinCancelButton
            onMouseOver={onEnterButton}
            onMouseLeave={onLeaveButton}
            onClick={onClickButton}
            disabled={false}
          /></ButtonWrapper>
          <ButtonWrapper><ThirtyMinCancelButton
            onMouseOver={onEnterButton}
            onMouseLeave={onLeaveButton}
            onClick={onClickButton}
            disabled={false}
          /></ButtonWrapper>
        </Slider>
      </Wrapper>
    )
  }
}

export default Header

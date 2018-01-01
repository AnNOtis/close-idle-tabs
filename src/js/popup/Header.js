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

export const DEFAULT_MISSION = 'KeepButton5'

const MISSION_MAPPING = {
  'KeepButton1': KeepOneTabsButton,
  'KeepButton3': KeepThreeTabsButton,
  'KeepButton5': KeepFiveTabsButton,
  'CancelButton300000': FiveMinCancelButton,
  'CancelButton900000': FifteenMinCancelButton,
  'CancelButton1800000': ThirtyMinCancelButton
}

const MISSIONS = [
  'KeepButton1',
  'KeepButton3',
  'KeepButton5',
  'CancelButton300000',
  'CancelButton900000',
  'CancelButton1800000'
]

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
  constructor () {
    super()
    this.handleSliderIndexChange = this.handleSliderIndexChange.bind(this)
    this.state = {
      isLoaded: false
    }
  }
  componentDidMount () {
    this.loadDefaultMission()
  }

  loadDefaultMission () {
    chrome.storage.sync.get({defaultMission: DEFAULT_MISSION}, ({defaultMission}) => {
      this.setState({
        isLoaded: true,
        defaultMission
      })
    })
  }

  handleSliderIndexChange (index) {
    this.saveDefaultMission(MISSIONS[index])
  }

  saveDefaultMission (defaultMission) {
    chrome.storage.sync.set({ defaultMission })
  }

  renderMissions () {
    const {
      onEnterButton: onMouseOver,
      onLeaveButton: onMouseLeave,
      onClickButton: onClick
    } = this.props

    return MISSIONS.map(mission => (
      <ButtonWrapper>
        {h(
          MISSION_MAPPING[mission],
          {
            onMouseOver,
            onMouseLeave,
            onClick,
            disabled: false
          }
        )}
      </ButtonWrapper>
    ))
  }

  render () {
    return (
      <Wrapper>
        {
          this.state.isLoaded &&
          <Slider
            defaultIndex={MISSIONS.indexOf(this.state.defaultMission)}
            onIndexChange={this.handleSliderIndexChange}
          >
            {this.renderMissions()}
          </Slider>
        }
      </Wrapper>
    )
  }
}

export default Header

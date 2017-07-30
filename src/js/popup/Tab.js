import { h, Component } from 'preact'
import { humanDuration } from '../utils/index'
import styled, { css, keyframes } from 'styled-components'
import v from 'css/variables'
import PinIcon from './icons/PinIcon'
import EyeIcon from './icons/EyeIcon'
import CrossIcon from './icons/CrossIcon'

const UNKNOW_FAVICON = '/assets/chrom-internal-icon.png'

const closeBgAnim = keyframes`
  from {
    background-position: -27px 0;
  }

  to {
    background-position: 0 0;
  }
`

const closeIconAnim = keyframes`
  from {
    left: -20px;
  }

  to {
    left: 0px;
  }
`

const Wrapper = styled.div`
  display: flex;
  position: relative;
  padding: ${props => props.isFixed ? 6 : 10}px 0;
  padding-left: 6px;
  padding-right: 6px;
  cursor: pointer;
  background-color: #fafbfd;
  border-radius: 3px;
  margin: 8px 12px;
  box-shadow: 0 0 1px 0 rgba(0,0,0,0.05);
  transition: all 0.3s;
  ${({isActive}) => isActive && css`
    background-color: #FFF;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
  `}
  ${({isActive}) => !isActive && css`
    &:hover {
      background-color: #FFF;
      z-index: 999;
      box-shadow: 0 0 10px 0 rgba(0,0,0,0.1)
    }

    &:active {
      box-shadow: 0 0 2px 0 rgba(0,0,0,0.1);
    }
  `}

  ${({isActive}) => isActive && css`
    cursor: default
  `}
`
const CloseHint = styled.span`
  animation: ${closeBgAnim} 0.3s ease-out 1;
  position: absolute;
  display: flex;
  background-color: ${v.red};
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 16px;
  color: white;
  font-size: 12px;
  align-items: center;
  justify-content: flex-end;
  padding-right: 3px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  background-image: linear-gradient(to right, ${v.red} 50%, white 0);
  background-size: 50px 100%;
  background-position: 0 0;

  svg {
    position: relative;
    animation: ${closeIconAnim} 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0.1s 1;
  }
`

const StatusIcon = styled.span`
  display: flex;
  font-size: 12px;
  align-self: center;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  color: ${v.lightenGrey};
`

const Favicon = styled.img`
  display: inline-block;
  flex: 0 0 20px;
  float: left;
  width: 20px;
  height: 20px;
  margin-right: 6px;
  align-self: center;
`

const Info = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 30px;
`

const Title = styled.div`
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  color: ${v.grey};
`

const IdleTime = styled.div`
  font-size: 12px;
  font-style: italic;
  color: ${v.lightenGrey};
  font-weight: lighter;
  line-height: 16px;
`

class Tab extends Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount () {
    this._timer = setInterval(() => {
      this.setState({ currentTime: new Date() })
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this._timer)
  }

  render ({tab, onClick, willBeClosed}) {
    const isFixed = tab.active || tab.pinned
    return (
      <Wrapper
        title={tab.title}
        onClick={this.handleClick}
        isFixed={isFixed}
        isActive={tab.active}
      >
        {willBeClosed && <CloseHint><CrossIcon /></CloseHint>}
        <StatusIcon>
          {(tab.pinned && !tab.active) && <PinIcon />}
          {tab.active && <EyeIcon />}
        </StatusIcon>
        <Favicon src={this.favicon(tab)} />
        <Info>
          <Title>{willBeClosed}{tab.title}</Title>
          {!isFixed && <IdleTime>{this.status(tab)}</IdleTime>}
        </Info>
      </Wrapper>
    )
  }

  handleClick () {
    const tab = this.props.tab

    chrome.tabs.highlight({tabs: tab.index, windowId: tab.windowId})
  }

  favicon (tab) {
    if (tab.favIconUrl && tab.favIconUrl.match(/^https?/)) {
      return tab.favIconUrl
    } else {
      return UNKNOW_FAVICON
    }
  }

  status (tab) {
    if (tab.pinned) {
      return 'pinned'
    } else if (tab.active) {
      return 'current'
    } else {
      if (!tab.lastActivedAt) return ''

      return `${humanDuration(this.state.currentTime - tab.lastActivedAt)} ago`
    }
  }
}

export default Tab

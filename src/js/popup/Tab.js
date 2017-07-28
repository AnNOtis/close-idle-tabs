import { h, Component } from 'preact'
import { humanDuration } from '../utils/index'
import styled, { css } from 'styled-components'
import v from 'css/variables'

const UNKNOW_FAVICON = '/assets/chrom-internal-icon.png'

const Wrapper = styled.div`
  position: relative;
  padding: 10px 6px;
  border-radius: 4px;
  cursor: pointer;
  ${({hasHoverEffect}) => !hasHoverEffect && css`
    &:hover {
      cursor: default;
      top: 0px;
      box-shadow: none;
    }
  `}

  ${({hasHoverEffect}) => hasHoverEffect && css`
    &:hover {
      top: -1px;
      box-shadow: 0 1px 0 2px #EEE;
    }
    &:active {
      top: 0px;
      box-shadow: 0 0 0 1px #EEE;
    }
  `}
`

const Favicon = styled.img`
  float: left;
  width: 16px;
  height: 16px;
  margin-right: 6px;
`

const Info = styled.div`
  overflow: auto;
`

const Title = styled.div`
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  color: ${v.grey};
`

const Status = styled.div`
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

  render ({tab, onClick}) {
    return (
      <Wrapper
        title={tab.title}
        onClick={this.handleClick}
        hasHoverEffect={!tab.active}
      >
        <Favicon src={this.favicon(tab)} />
        <Info>
          <Title>{tab.title}</Title>
          <Status>{this.status(tab)}</Status>
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

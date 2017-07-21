import { h, Component } from 'preact'
import { humanDuration } from '../utils'
import cx from 'classnames'

const UNKNOW_FAVICON = '/assets/chrom-internal-icon.png'

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
      <div
        title={tab.title}
        class={cx('tab', {'tab--current': tab.active})}
        onClick={this.handleClick}
      >
        <img class='tab-favicon' src={this.favicon(tab)} />
        <div class='tab-info'>
          <div class='tab-info-title'>{tab.title}</div>
          <div class='tab-info-state'>{this.status(tab)}</div>
        </div>
      </div>
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
      return 'active now'
    } else {
      if (!tab.lastActivedAt) return ''

      return `actived at ${humanDuration(this.state.currentTime - tab.lastActivedAt)} ago`
    }
  }
}

export default Tab

import { h, Component } from 'preact'
import { humanDuration } from '../utils'

const UNKNOW_FAVICON = '/assets/chrom-internal-icon.png'

class Tab extends Component {
  render ({tab}) {
    return (
      <div class='tab'>
        <img class='tab-favicon' src={this.favicon(tab)} />
        <div class='tab-info'>
          <div class='tab-info-title'>{tab.title}</div>
          <div class='tab-info-state'>{this.status(tab)}</div>
        </div>
      </div>
    )
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
      return `actived ${humanDuration(new Date() - tab.lastActivedAt)} ago`
    }
  }
}

export default Tab

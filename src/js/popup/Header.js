import { h, Component } from 'preact'
import { maybePlural } from '../utils/index'

class Button extends Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  render (props) {
    const unwantedTabCount = props.unwantedTabs.length
    const wantedTabCount = props.wantedTabs.length

    if (!unwantedTabCount) {
      return <button class='btn btn--disable'>
        <div class='btn-content'>No Idle Tabs</div>
      </button>
    }

    return (
      <button class='btn' onClick={this.handleClick}>
        <div class='btn-content'>Close Idle Tabs</div>
        <div class='btn-hint'>
          leave {wantedTabCount} active {maybePlural(wantedTabCount, 'tab')}
        </div>
      </button>
    )
  }

  handleClick () {
    chrome.extension.getBackgroundPage().closeUnwantedTabs()
    this.props.onClick()
  }
}

class Header extends Component {
  render ({unwantedTabs, wantedTabs, onRefetch}) {
    return (
      <div class='header'>
        <Button unwantedTabs={unwantedTabs} wantedTabs={wantedTabs} onClick={onRefetch} />
      </div>
    )
  }
}

export default Header

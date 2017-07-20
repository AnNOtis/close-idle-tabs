import { h, Component } from 'preact'
import { maybePlural } from '../utils'

const Button = ({ children, ...props }) => {
  console.log(props);
  const wantedTabCount = props.wantedTabs.length
  return (
    <button class='btn'>
      <div class='btn-content'>Close Idle Tabs</div>
      <div class='btn-hint'>
        leave {wantedTabCount} active {maybePlural(wantedTabCount, 'tab')}
      </div>
    </button>
  )
}
class Header extends Component {
  render ({wantedTabs}) {
    return <div class='header'><Button wantedTabs={wantedTabs} /></div>
  }
}

export default Header

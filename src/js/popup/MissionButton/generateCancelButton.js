/** @jsx h */
import { h, Component } from 'preact'
import PrimaryButton from '../buttons/PrimaryButton'
import styled from 'styled-components'
import v from 'css/variables'
import { humanDuration } from '../../utils/index'

function getRemovableTabs (tabs) {
  return tabs.filter(tab => !tab.active && !tab.pinned)
}

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

const generateCancelButton = (idleThreshold) => {
  class CancelButton extends Component {
    constructor (props) {
      super(props)

      this.filter = this.filter.bind(this)
      this.handleMouseOver = this.handleMouseOver.bind(this)
      this.handleClick = this.handleClick.bind(this)
    }

    filter (tabs) {
      return getRemovableTabs(tabs)
        .filter(tab => (Date.now() - tab.lastActivedAt) > idleThreshold)
    }

    handleMouseOver () {
      this.props.onMouseOver(this.filter)
    }

    handleClick () {
      this.props.onClick(this.filter)
    }

    render ({
      onMouseLeave,
      disabled
    }) {
      return <PrimaryButton
        onMouseOver={this.handleMouseOver}
        onMouseLeave={onMouseLeave}
        onClick={this.handleClick}
        disabled={disabled}
      >
        <ButtonHint>close tabs idle for</ButtonHint>
        <Strong>{humanDuration(idleThreshold)}</Strong>
      </PrimaryButton>
    }
  }
  CancelButton.displayName = `CancelButton${idleThreshold}`
  return CancelButton
}
export default generateCancelButton

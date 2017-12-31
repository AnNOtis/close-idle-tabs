/** @jsx h */
import { h, Component } from 'preact'
import PrimaryButton from '../buttons/PrimaryButton'
import styled from 'styled-components'
import v from 'css/variables'

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

function getRemovableTabs (tabs) {
  return tabs.filter(tab => !tab.pinned)
}

const generateKeepButton = (remainedTabsNumber) => (
  class KeepButton extends Component {
    constructor (props) {
      super(props)

      this.filter = this.filter.bind(this)
      this.handleMouseOver = this.handleMouseOver.bind(this)
      this.handleClick = this.handleClick.bind(this)
    }

    filter (tabs) {
      const removableTabs = getRemovableTabs(tabs)
      const fixedTabsNumber = tabs.length - removableTabs.length
      if (fixedTabsNumber >= remainedTabsNumber) return []

      return removableTabs.slice(remainedTabsNumber - fixedTabsNumber)
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
        <ButtonHint>leave tabs for first</ButtonHint>
        <Strong>{remainedTabsNumber}</Strong>
      </PrimaryButton>
    }
  }
)

export default generateKeepButton

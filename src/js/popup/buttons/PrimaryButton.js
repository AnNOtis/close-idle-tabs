import v from 'css/variables'
import Button from './Button'

export default Button.extend`
  background-color: ${v.yellow};
  box-shadow: 0 1px 0 1px ${v.darkenYellow};
  &:hover {
    top: -1px;
    box-shadow: 0 2px 0 1px ${v.darkenYellow};
  }
  &:active {
    top: 1px;
    box-shadow: 0 0 0 1px ${v.darkenYellow};
  }
`

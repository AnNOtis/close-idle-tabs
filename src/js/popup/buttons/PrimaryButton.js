import v from 'css/variables'
import Button from './Button'
import { css } from 'styled-components'

export default Button.extend`
  background-color: ${v.yellow};
  box-shadow: 0 1px 0 1px ${v.darkenYellow};

  ${props => props.disabled && css`
    cursor: default;
    box-shadow: none;

    > * {
      opacity: 0.3;
    }

    &:before {
      display: none;
      opacity: 0;
      transition: 0.3s opacity;
      font-size: 24px;
      content: 'No Idle Tabs';
      position: absolute;
      display: block;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      color: ${v.grey};
      font-family: ${v.fontHeader};
      font-weight: bold;
      font-style: italic;
      text-align: center;
      z-index: 1;
    }

    &:hover:before {
      display: block;
      opacity: 1;
    }
  `}

  ${props => !props.disabled && css`
    &:hover {
      top: -1px;
      box-shadow: 0 2px 0 1px ${v.darkenYellow};
    }
    &:active {
      top: 1px;
      box-shadow: 0 0 0 1px ${v.darkenYellow};
    }
  `}
`

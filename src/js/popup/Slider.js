/** @jsx h */
import { h, Component } from 'preact'
import styled from 'styled-components'
import LeftArrow from './icons/LeftArrow'
import RightArrow from './icons/RightArrow'

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%
`

const Arrow = styled.button`
  display: flex;
  width: 30px;
  opacity: 0.5;
  padding: 0;
  font-size: 30px;
  align-items: center;
  background: none;
  border: none;
  outline: none;
  color: #aaa;
  cursor: pointer;
  text-shadow: 1px 1px #333;
  :hover {
    color: #999;
  }
  :active {
    color: #888;
  }
`

const Content = styled.div`
  flex: 1;
  overflow: hidden;
`

const River = styled.div`
  ::after
    content: "";
    display: table;
    clear: both;
`

class Slider extends Component {
  constructor (props) {
    super(props)
    this.handleRightArrowClick = this.handleRightArrowClick.bind(this)
    this.handleLeftArrowClick = this.handleLeftArrowClick.bind(this)
    this.state = {
      index: this.props.defaultIndex || 0,
      isAnimated: false // keep false until clicking arrow
    }
  }

  componentDidMount () {
    this.setState({
      contentWidth: this.contentEl.base.clientWidth
    })
  }

  changeIndex (index) {
    this.setState({ index, isAnimated: true }, () => this.props.onIndexChange(index))
  }

  handleRightArrowClick () {
    let nextIndex = this.state.index + 1
    if (nextIndex === this.props.children.length) { nextIndex = 0 }
    this.changeIndex(nextIndex)
  }

  handleLeftArrowClick () {
    let nextIndex = this.state.index - 1
    if (nextIndex < 0) { nextIndex = this.props.children.length - 1 }
    this.changeIndex(nextIndex)
  }

  renderRiver () {
    const {
      contentWidth,
      index
    } = this.state
    const riverWidth = contentWidth * (this.props.children.length || 1)
    return (
      <River style={{
        width: riverWidth,
        transform: `translate3d(-${contentWidth * index}px, 0, 0)`,
        transition: this.state.isAnimated && 'transform 0.5s'
      }}>
        {this.props.children.map((child) => (
          <div style={{
            width: contentWidth,
            float: 'left',
            height: '100%',
            minHeight: '1px'
          }}>
            {child}
          </div>
        ))}
      </River>
    )
  }

  render (children) {
    return (
      <Wrapper>
        <Arrow onClick={this.handleLeftArrowClick}><LeftArrow /></Arrow>
        <Content ref={(el) => { this.contentEl = el }}>
          {this.renderRiver()}
        </Content>
        <Arrow onClick={this.handleRightArrowClick}><RightArrow /></Arrow>
      </Wrapper>
    )
  }
}

export default Slider

import { h, Component } from 'preact'

class App extends Component {
	render() {
		let time = new Date().toLocaleTimeString();
		return <span>{ time }</span>;
	}
}

export default App

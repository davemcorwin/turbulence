import React from 'react'
import flowchart from 'flowchart.js'

export default class Diagram extends React.Component {

  updateDiagram() {
    try {
      this._el && this.props.plan && flowchart.parse(this.props.plan).drawSVG(this._el)
    } catch(err) {
      // do nothing
    }
  }

  componentDidMount() {
    this.updateDiagram()
  }

  componentWillUpdate() {
    this._el && this._el.childNodes && this._el.childNodes[0] && this._el.removeChild(this._el.childNodes[0])
  }

  componentDidUpdate() {
    this.updateDiagram()
  }

  render() {
    return <div ref={el => this._el = el}></div>
  }
}

import React from 'react'
import Diagram from './Diagram'

export default class DiagramContainer extends React.Component{

  constructor(props) {
    super()
    this.state = { plan: props.diagram.plan }
  }

  // shoudComponentUpdate(nextProps) {
  //   return this.props.diagram.plan !== nextProps.diagram.plan
  // }

  updatePlan(e) {
    e.preventDefault()
    const plan = e.currentTarget.value
    this.setState(
      { plan },
      this.props.update(plan)
    )
  }

  render() {

    const { remove, diagram, idx, update } = this.props

    return (
      <div className="diagram-container">
        <h3>{idx+1}. {diagram.title}
          <a
            href="#"
            onClick={remove}
            style={{
              float: 'right',
              textDecoration: 'none'
            }}>

            X
          </a>
        </h3>
        <textarea rows="10" cols="40" value={this.state.plan} onChange={this.updatePlan.bind(this)}/>
        <Diagram plan={this.state.plan} />
      </div>
    )
  }
}

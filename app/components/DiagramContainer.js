import React from 'react'
import Diagram from './Diagram'

export default class DiagramContainer extends React.Component{

  shoudComponentUpdate(nextProps) {
    return this.props.diagram.plan !== nextProps.diagram.plan
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
        <textarea rows="10" cols="40" value={diagram.plan} onChange={update}/>
        <Diagram plan={diagram.plan} />
      </div>
    )
  }
}

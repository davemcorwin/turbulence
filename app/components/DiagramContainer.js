import React from 'react'
import Diagram from './Diagram'

export default ({ diagram, idx, update }) =>
  <div className="diagram-container">
    <h3>{idx+1}. {diagram.title}</h3>
    <textarea rows="10" cols="40" value={diagram.plan} onChange={update}/>
    <Diagram plan={diagram.plan} />
  </div>

import React from 'react'
import Diagram from './Diagram'

export default class Legend extends React.Component {
  constructor() {
    super()
    this.state = { show: false }
  }

  toggleLegend(e) {
    e.preventDefault()
    this.setState({ show: !this.state.show })
  }

  render() {

    const { show } = this.state

    return (
      <div>

        <div className="legend-toggle">
          <a
            href="#"
            className="legend-toggle-link"
            onClick={this.toggleLegend.bind(this)}>

            { show ? '>>' : '<<' }
          </a>
        </div>

        <aside className="legend">

          {this.props.legendEntries.map((entry, idx) =>
            <div key={idx}>
              <p><b>{entry.title}</b></p>
              <p><b>Syntax:  </b><i>{entry.syntax}</i></p>
              <p><b>Example:  </b><i>{entry.example}</i></p>
              <Diagram plan={entry.code} />
            </div>
          )}
        </aside>
      </div>
    )
  }
}

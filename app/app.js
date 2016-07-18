import React from 'react'
import flowchart from 'flowchart.js'

// const diagrams = [{
//   title: '1. CashUp Creates Client',
//   plan: `
// st=>start: $
// io=>inputoutput: Enter client info and locations
// op1=>operation: Invite sent to client to create acct
// e=>end
//
// st->io->op1->e
//   `
// },{
//   title: '2. CashUp Updates Safe Details',
//   plan: `
// st=>start: $
// io=>inputoutput: Enter client info and locations
// op1=>operation: Invite sent to client to create acct
// e=>end
//
// st->io->op1->e
//   `
// }, {
//   title: '3. Client Receives Invitation',
//   plan: `
// st=>start: $
// io=>inputoutput: Enter client info and locations
// op1=>operation: Invite sent to client to create acct
// e=>end
//
// st->io->op1->e
//   `
// }]

const defaultPlan = `st=>start: Start
op1=>operation: Operation
e=>end

st->op1->e
`

class Flow extends React.Component {

  updateDiagram() {
    flowchart.parse(this.props.diagram.plan).drawSVG(this._el)
  }

  componentDidMount() {
    this.updateDiagram()
  }

  componentWillUpdate() {
    this._el.removeChild(this._el.childNodes[0])
  }

  componentDidUpdate() {
    this.updateDiagram()
  }

  render() {
    const { diagram, idx, update } = this.props

    return (
      <div className="diagram-container">
        <h3>{idx+1}. {diagram.title}</h3>
        <textarea rows="10" cols="40" value={diagram.plan} onChange={update}/>
        <div ref={el => this._el = el}></div>
      </div>
    )
  }
}

export default class App extends React.Component {

  constructor() {
    super()
    this.state = { diagrams: [] }
  }

  updateDiagram(idx, e) {
    e.preventDefault()

    const { diagrams } = this.state

    const newDiagram = { ...diagrams[idx], plan: e.currentTarget.value }
    diagrams.splice(idx, 1, newDiagram)

    this.setState({ diagrams: [ ...diagrams ] })
  }

  newDiagram(e) {
    e.preventDefault()
    const title = e.currentTarget.title.value
    if (title) {
      this.setState(
        { diagrams: [ ...this.state.diagrams, { title: title, plan: defaultPlan}] },
        e.currentTarget.title.value = ''
      )
    }
  }

  render() {
    return (
      <div>
        <h1>Onboarding Flows</h1>
        <form onSubmit={this.newDiagram.bind(this)}>
          <input type="text" name="title"/>
          <button type="submit">New Diagram</button>
        </form>

        { this.state.diagrams.map((diagram, idx) =>
          <Flow
            key={idx}
            diagram={diagram}
            idx={idx}
            update={this.updateDiagram.bind(this, idx)} />)
        }
      </div>
    )
  }
}

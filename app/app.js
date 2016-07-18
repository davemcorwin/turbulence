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

const legendEntries = [{
  title:   'Start',
  syntax:  '<name>=>start: <text>',
  example: 'st=>start: FooStart',
  code:    'st=>start: FooStart\nst->'
}, {
  title:   'End',
  syntax:  '<name>=>end: <text>',
  example: 'e=>end: FooEnd',
  code:    'e=>end: FooEnd\ne->'
}, {
  title:   'Operation',
  syntax:  '<name>=>operation: <text>',
  example: 'op=>operation: FooOperation',
  code:    'op=>operation: FooOperation\nop->'
}, {
  title:   'Subroutine',
  syntax:  '<name>=>subroutine: <text>',
  example: 'sub=>subroutine: Subroutine',
  code:    'sub=>subroutine: Subroutine\nsub->'
}, {
  title:   'Input/Output',
  syntax:  '<name>=>inputoutput: <text>',
  example: 'io=>inputoutput: FooInput',
  code:    'io=>inputoutput: FooInput\nio->'
}, {
  title:   'Condition',
  syntax:  '<name>=>condition: <text>',
  example: 'cond=>condition: Yes or Foo?',
  code:    'cond=>condition: Yes or Foo?\ncond->'
}]

const legendStyles = show => ({
  position: 'fixed',
  backgroundColor: '#DCDCDC',
  width: '300px',
  right: show ? '0' : '-300'
})

const legendToggleStyles = {
  backgroundColor: '#DCDCDC',
  borderRight: 'none',
  marginLeft: '-100px',
  marginTop: '40px',
  width: '100px',
  height: '40px',
  fontSize: '24px',
  textAlign: 'center',
}

const linkStyles = {
  textDecoration: 'none',
  color: 'black'
}

const LegendEntry = ({ entry }) =>
  <div>
    <p><b>{entry.title}</b></p>
    <p><b>Syntax:  </b><i>{entry.syntax}</i></p>
    <p><b>Example:  </b><i>{entry.example}</i></p>
    <span ref={el => flowchart.parse(entry.code).drawSVG(el)}></span>
  </div>

class Legend extends React.Component {
  constructor() {
    super()
    this.state = { show: false }
  }

  toggleLegend(e) {
    e.preventDefault()
    this.setState({ show: !this.state.show })
  }

  render() {
    return (
      <aside style={legendStyles(this.state.show)}>
        <div style={legendToggleStyles}>
          <a href="#" style={linkStyles} onClick={this.toggleLegend.bind(this)}>
            Legend
          </a>
        </div>
        {legendEntries.map((entry, idx) =>
          <LegendEntry key={idx} entry={entry} />
        )}
      </aside>
    )
  }
}

class Flow extends React.Component {

  updateDiagram() {
    try {
      flowchart.parse(this.props.diagram.plan).drawSVG(this._el)
    } catch(err) {
      console.log(err)
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
            update={this.updateDiagram.bind(this, idx)} />
        )}

        <Legend />
      </div>
    )
  }
}

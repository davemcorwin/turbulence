import React from 'react'

import {
  DiagramForm,
  DiagramContainer,
  Legend
} from './components'

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
export default class App extends React.Component {

  constructor() {
    super()
    this.state = initialState()
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
        { diagrams: [ ...this.state.diagrams, { title: title, plan: this.state.defaultPlan}] },
        e.currentTarget.title.value = ''
      )
    }
  }

  render() {
    return (
      <div>

        <h1>Onboarding Flows</h1>

        <DiagramForm onSubmit={this.newDiagram.bind(this)} />

        { this.state.diagrams.map((diagram, idx) =>
          <DiagramContainer
            diagram={diagram}
            idx={idx}
            key={idx}
            update={this.updateDiagram.bind(this, idx)} />
        )}

        <Legend legendEntries={this.state.legendEntries} />

      </div>
    )
  }
}

const initialState = () => ({
  diagrams: [],
  defaultPlan: `
  st=>start: Start
  op1=>operation: Operation
  e=>end

  st->op1->e
  `,
  legendEntries: [{
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
    example: 'cond=>condition: Yes or No?',
    code:    `
  st=>start: Start
  op=>operation: Op
  e=>end: End
  cond=>condition: Yes or No?

  st->cond
  cond(yes)->op
  cond(no)->e`
  }]
})

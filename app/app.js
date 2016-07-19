import React from 'react'

import {
  DiagramForm,
  DiagramContainer,
  Legend
} from './components'

export default class App extends React.Component {

  constructor() {
    super()
    this.state = initialState()
  }

  updateDiagram(diagramId, e) {
    e.preventDefault()

    const { diagrams } = this.state

    const newDiagram = {
      ...diagrams.find(diagram => diagram.id === diagramId),
      plan: e.currentTarget.value
    }

    diagrams.splice(idx, 1, newDiagram)

    this.setState({ diagrams: [ ...diagrams ] })
  }

  newDiagram(e) {
    e.preventDefault()
    const title = e.currentTarget.title.value
    if (title) {
      this.setState({
        diagrams: [
          ...this.state.diagrams,
          {
            id: (Math.max(this.state.diagrams.map(diagram => diagram.id)) || 0) + 1,
            project: this.state.project.id,
            title: title,
            plan: this.state.defaultPlan
          }
        ]
      }, e.currentTarget.title.value = '')
    }
  }

  deleteDiagram(diagramId, e) {
    e.preventDefault()
    this.setState({
      diagrams: [ ...this.state.diagrams.filter(diagram => diagram.id !== diagramId) ]
    })
  }

  selectProject(projectId, e) {
    e.preventDefault()
    this.setState({
      project: this.state.projects.find(project => project.id === projectId)
    })
  }

  render() {
    return (
      <div>

        <h1 style={{textAlign: 'center'}}>Turbulance</h1>

        <div className="projects-container">
          <h3>Projects</h3>
          <ul>
            {this.state.projects.map(project =>
              <li><a href="#" onClick={this.selectProject.bind(this, project.id)}>{project.name}</a></li>
            )}
          </ul>
        </div>

        { this.state.project ?
          <div className="project-container">
            <h3>{this.state.project.name}</h3>

            <DiagramForm onSubmit={this.newDiagram.bind(this)} />

            { this.state.diagrams
                .filter(diagram => diagram.project === this.state.project.id)
                .map((diagram, idx) =>
              <DiagramContainer
                remove={this.deleteDiagram.bind(this, diagram.id)}
                diagram={diagram}
                idx={idx}
                key={idx}
                update={this.updateDiagram.bind(this, diagram.id)} />
            )}
          </div>
          : null
        }

        <Legend legendEntries={this.state.legendEntries} />

      </div>
    )
  }
}

const initialState = () => ({
  project: null,
  projects: [{
    id:   1,
    name: 'CashUp',
    slug: 'cashup'
  },{
    id:   2,
    name: 'Trusted Herd',
    slug: 'trusted-herd'
  }],
  diagrams: [],
  defaultPlan: `st=>start: Start
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

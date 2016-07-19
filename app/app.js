import React from 'react'
import PouchDB from 'pouchdb'
import _ from 'lodash'

import {
  DiagramForm,
  DiagramContainer,
  Legend
} from './components'

export default class App extends React.Component {

  constructor() {
    super()
    this.state = initialState()
    this.updatePouch = this.updatePouch.bind(this)
  }

  initializePouch() {

    this.db
      .allDocs({ include_docs: true })
      .then(doc =>
        this.setState({
          projects: doc.rows.filter(row => row.doc.type === 'project').map(row => row.doc),
          diagrams: doc.rows.filter(row => row.doc.type === 'diagram').map(row => row.doc)
        })
      )
  }

  updatePouch(change) {

    const doc = change.doc

    const newState = {
      projects: this.state.projects.filter(prj => prj._id !== doc._id),
      diagrams: this.state.diagrams.filter(dgm => dgm._id !== doc._id)
    }

    if (!change.deleted)
      newState[`${doc.type}s`] = [ ...newState[`${doc.type}s`], doc ]

    this.setState(newState)
  }

  componentDidMount() {
    this.db = new PouchDB('turbulence')
    // this.remote = new PouchDB('http://turbulence.smileupps.com')
    // this.sync = PouchDB.sync(this.db, this.remote, { live: true, retry: true })

    this.db
      .changes({ since: 'now', live: true, include_docs: true })
      .on('change', this.updatePouch)

    this.initializePouch()
  }

  componentWillUnmount() {
    this.sync.cancel()
  }

  updateDiagram(diagramId, plan) {
    this.db.put({
      ..._.find(this.state.diagrams, {_id: diagramId}),
      plan
    })
  }

  newDiagram(e) {
    e.preventDefault()
    const el = e.currentTarget.title
    const title = el.value
    if (title) {
      this.db.post({
        type: 'diagram',
        project: this.state.project._id,
        title: title,
        plan: this.state.defaultPlan
      }).then(() => el.value = '')
    }
  }

  deleteDiagram(diagramId, e) {
    e.preventDefault()
    this.db.remove(this.state.diagrams.find(diagram => diagram._id === diagramId))
  }

  selectProject(projectId, e) {
    e.preventDefault()
    this.setState({
      project: this.state.projects.find(project => project._id === projectId)
    })
  }

  newProject(e) {
    e.preventDefault()
    const el = e.currentTarget.name
    const name = el.value
    if (name) {
      this.db.post({
        type: 'project',
        name: name,
        slug: _.kebabCase(name)
      }).then(() => el.value = '')
    }
  }

  deleteProject(projectId, e) {
    e.preventDefault()
    this.db.remove(_.find(this.state.projects, { _id: projectId }))
  }

  render() {

    const projects = _.sortBy(this.state.projects, '_id')

    return (
      <div>

        <h1 style={{textAlign: 'center'}}>Turbulence</h1>

        <div className="projects-container">
          <h3>Projects</h3>
          <form onSubmit={this.newProject.bind(this)}>
            <input type="text" name="name" placeholder="New Project..." />
            <button type="submit">Add</button>
          </form>
          <ul style={{listStyleType: 'none', paddingLeft: '5px'}}>
            {projects.map(project =>
              <li key={project._id} style={{marginBottom: '5px'}}>
                <a
                  href="#"
                  onClick={this.selectProject.bind(this, project._id)}>

                  {project.name}
                </a>
                <a
                  href="#"
                  onClick={this.deleteProject.bind(this, project._id)}
                  style={{
                    float: 'right',
                    marginRight: '90px',
                    textDecoration: 'none'
                  }}>

                  X
                </a>
              </li>
            )}
          </ul>
        </div>

        { this.state.project ?
          <div className="project-container">
            <h3>{this.state.project.name}</h3>

            <DiagramForm onSubmit={this.newDiagram.bind(this)} />

            { _.chain(this.state.diagrams)
                .filter({ project: this.state.project._id })
                .sortBy('_id')
                .map((diagram, idx) =>
                  <DiagramContainer
                    remove={this.deleteDiagram.bind(this, diagram._id)}
                    diagram={diagram}
                    idx={idx}
                    key={diagram._id}
                    update={this.updateDiagram.bind(this, diagram._id)} />
                )
                .value()
            }
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
  projects: [],
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

import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

const load = () => ReactDOM.render(<App/>, document.getElementById('app'))

if (document.readyState !== 'complete') {
  document.addEventListener('DOMContentLoaded', load)
} else {
  load()
}

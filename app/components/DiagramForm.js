import React from 'react'

export default ({ onSubmit }) =>
  <form onSubmit={onSubmit}>
    <input type="text" name="title"/>
    <button type="submit">New Diagram</button>
  </form>

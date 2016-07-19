import React from 'react'

export default ({ onSubmit }) =>
  <form onSubmit={onSubmit}>
    <input type="text" name="title" placeholder="New Diagram..."/>
    <button type="submit">Add</button>
  </form>

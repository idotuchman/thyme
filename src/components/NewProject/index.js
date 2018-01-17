import React, { Component } from 'react';

import ProjectInput from '../ProjectInput';
import Button from '../Button';

import './NewProject.css';

function defaultState() {
  return {
    name: '',
    parent: null,
  };
}

class NewProject extends Component {
  constructor(props) {
    super(props);

    this.onNameChange = e => this.onValueChange('name', e.target.value);
    this.onProjectChange =
        project => this.onValueChange('project', project === null ? null : project.value);
    this.onSubmit = this.addNew.bind(this);

    this.state = defaultState();
  }

  onValueChange(key, value) {
    this.setState({
      [key]: value,
    });
  }

  addNew() {
    const { onAddProject } = this.props;

    if (this.state.name.trim() === '') {
      return;
    }

    onAddProject({
      ...this.state,
    });

    this.setState(defaultState());
  }

  render() {
    const { name, parent } = this.state;

    return (
      <div className="NewProject">
        <input
          id="project-name"
          name="project-name"
          className="NewProject__input"
          type="text"
          placeholder="Project name"
          value={name}
          onChange={this.onNameChange}
        />
        <ProjectInput handleChange={this.onProjectChange} value={parent} />
        <Button value="Add project" onClick={this.onSubmit} />
      </div>
    );
  }
}

export default NewProject;
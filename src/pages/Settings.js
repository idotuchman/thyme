// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import FileSaver from 'file-saver';
import format from 'date-fns/format';

import { stateToExport, validData } from '../core/importExport';

import { importJSONData } from '../actions/app';
import { truncateTime } from '../actions/time';
import { truncateProjects } from '../actions/projects';

import Button from '../components/Button';

type SettingsType = {
  time: any,
  projects: any,
  removeTimeData: () => void,
  removeProjectData: () => void,
  importData: (data: any) => void,
};

class Settings extends Component<SettingsType> {
  constructor(props) {
    super(props);

    this.onRemoveTime = () => {
      if (window.confirm('Are you SUPER sure you want to remove all timesheet data?')) {
        props.removeTimeData();
      }
    };

    this.onRemoveProjects = () => {
      if (window.confirm('Are you SUPER sure you want to remove all projects data?')) {
        props.removeProjectData();
      }
    };

    this.onExportData = this.exportData.bind(this);
    this.onImportData = this.importData.bind(this);

    // create file upload element
    const input = document.createElement('input');
    input.setAttribute('name', 'upload');
    input.setAttribute('type', 'file');

    input.addEventListener('change', this.handleFileChange.bind(this));

    this.uploadInput = input;
  }

  onRemoveTime: () => void;
  onRemoveProjects: () => void;
  onExportData: () => void;
  onImportData: () => void;
  uploadInput: HTMLInputElement;

  exportData() {
    const { time, projects } = this.props;

    const stateToSave = stateToExport({ time, projects });

    const blob = new Blob(
      [JSON.stringify(stateToSave)],
      { type: 'application/json;charset=utf-8' },
    );

    FileSaver.saveAs(blob, `thyme-export_${format(new Date(), 'YYYY-MM-DD')}.json`);
  }

  importData() {
    if (
      window.confirm('If you import data it will overwrite your current data. Wish to continue?')
    ) {
      // open file dialog
      this.uploadInput.click();
    }
  }

  handleImportData(jsonString: string) {
    try {
      const importData = JSON.parse(jsonString);

      if (!validData(importData)) {
        alert('The provided JSON is not a valid Thyme timesheet');
        return;
      }

      this.props.importData(importData);

      alert('Import successful');
    } catch (e) {
      alert(e.message);
    }
  }

  handleFileChange(e) {
    if (e.target instanceof HTMLInputElement === false) {
      return;
    }

    if (e.target.files instanceof FileList) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.handleImportData(ev.target.result);
      };
      reader.readAsText(e.target.files[0]);
    }
  }

  render() {
    return (
      <div>
        <h2>Settings</h2>

        <h4>Export / Import</h4>
        <Button value="Export data" onClick={this.onExportData} />
        <Button value="Import data" onClick={this.onImportData} />

        <h4>Delete data</h4>
        <Button red value="Remove timesheet data" onClick={this.onRemoveTime} />
        <Button red value="Remove project data" onClick={this.onRemoveProjects} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { time, projects } = state;

  return { time, projects };
}

function mapDispatchToProps(dispatch) {
  return {
    removeTimeData() {
      dispatch(truncateTime());
    },

    removeProjectData() {
      dispatch(truncateProjects());
    },

    importData(data) {
      dispatch(importJSONData(data));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

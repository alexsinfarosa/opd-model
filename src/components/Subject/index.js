import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";

import Select from "antd/lib/select";
import "antd/lib/select/style/css";
const Option = Select.Option;

@inject("store")
@observer
export default class Specie extends Component {
  handleChange = value => {
    const { areRequiredFieldsSet } = this.props.store.app;
    const mobile = this.props.size;
    this.props.store.app.setSpecie(value);
    if (areRequiredFieldsSet && mobile) {
      this.props.store.app.setIsSidebarOpen(false);
    }
    this.props.store.app.setStage();
  };

  render() {
    const { specie, species } = this.props.store.app;

    const speciesList = species.map((specie, i) => {
      return (
        <Option key={i} value={specie.informalName}>
          {specie.informalName}
        </Option>
      );
    });
    return (
      <div style={{ marginBottom: "2rem" }}>
        <label>Specie:</label>
        <Select
          name="specie"
          size="large"
          autoFocus
          value={specie.informalName}
          placeholder="Select Specie"
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          {speciesList}
        </Select>
      </div>
    );
  }
}

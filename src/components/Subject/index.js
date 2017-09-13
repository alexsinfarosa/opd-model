import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

import Cascader from "antd/lib/cascader";
import "antd/lib/cascader/style/css";

@inject("store")
@observer
export default class Specie extends Component {
  handleChange = value => {
    const mobile = this.props.size;
    this.props.store.app.setSpecie(value[1]);

    if (this.props.store.app.areRequiredFieldsSet) {
      this.props.store.app.setIsMap(false);
    }

    if (this.props.store.app.areRequiredFieldsSet && mobile) {
      this.props.store.app.setIsSidebarOpen(false);
    }
    this.props.store.app.setStage();
  };

  render() {
    const { specie, species } = this.props.store.app;

    const options = species.map(p => {
      return {
        value: p.subgroup,
        label: p.subgroup,
        children: [
          {
            value: p.informalName,
            label: p.informalName
          }
        ]
      };
    });

    const pest = toJS(specie);

    return <div style={{ marginBottom: "2rem" }}>
        <label>Pest:</label>
        <Cascader autoFocus expandTrigger="hover" allowClear={false} size="large" options={options} onChange={this.handleChange} defaultValue={[pest.subgroup, pest.informalName]} style={{ width: 200 }} placeholder="Select Pest" />
      </div>;
  }
}

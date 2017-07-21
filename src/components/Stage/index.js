import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { toJS } from "mobx";
// import { Select } from "antd";
import Select from "antd/lib/select";
import "antd/lib/select/style/css";
const Option = Select.Option;

//  reflexbox
import { Box } from "reflexbox";

@inject("store")
@observer
class Stage extends Component {
  constructor(props) {
    super(props);

    this.props.store.app.setStage();
  }
  handleChange = stageName => {
    this.props.store.app.updateStage(stageName);
  };

  render() {
    const { stages, stage } = this.props.store.app;
    const selectedStage = stage.slice()[0];

    const stageList = stages.map((stage, i) =>
      <Option key={i} value={stage.name}>
        {stage.name}
      </Option>
    );

    return (
      <Box>
        <label style={{ color: "black", fontSize: ".9rem" }}>
          Phenological Stage{" "}
        </label>
        <Select
          name="stage"
          size="large"
          value={selectedStage ? selectedStage.name : "Calculating stage..."}
          placeholder="Select Phenological Stage"
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          {stageList}
        </Select>
      </Box>
    );
  }
}

export default Stage;

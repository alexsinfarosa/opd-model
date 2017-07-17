import React, { Component } from "react";
import { inject, observer } from "mobx-react";
// import { Select } from "antd";
import Select from "antd/lib/select";
import "antd/lib/select/style/css";
const Option = Select.Option;

//  reflexbox
import { Box } from "reflexbox";

@inject("store")
@observer
class Stage extends Component {
  handleChange = value => {};
  render() {
    const { specie, species } = this.props.store.app;
    const specieList = species.map(specie =>
      <Option key={specie.formalName} value={specie.informalName}>
        {specie.informalName}
      </Option>
    );
    return (
      <Box>
        <label>Phenological Stage </label>
        <Select
          name="stage"
          size="large"
          value={specie.informalName}
          placeholder="Select Phenological Stage"
          style={{ width: 200 }}
          onChange={this.handleChange}
        >
          {specieList}
        </Select>
      </Box>
    );
  }
}

export default Stage;

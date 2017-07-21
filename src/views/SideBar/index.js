import React, { Component } from "react";
import { inject, observer } from "mobx-react";

// antd
// import Switch from "antd/lib/switch";
// import "antd/lib/switch/style/css";

import Button from "antd/lib/button";
import "antd/lib/button/style/css";

// components
import Subject from "components/Subject";
import State from "components/State";
import Station from "components/Station";
import DatePicker from "components/DatePicker";
import Acknowledgements from "components/Acknowledgements";

import { Box } from "reflexbox";

// styled-components
import { SideBarContent } from "./styles";

@inject("store")
@observer
class SideBar extends Component {
  // toggle Map component
  toggleMap = () => {
    // console.log(`switch to ${checked}`);
    this.props.store.app.toggleIsMap();
    this.props.store.app.setIsSidebarOpen(false);
  };

  toggleStage = () => {
    // console.log(`switch to ${checked}`);
    this.props.store.app.setIsStage();
    this.props.store.app.setIsSidebarOpen(false);
  };

  toggleGraph = () => {
    // console.log(`switch to ${checked}`);
    this.props.store.app.setIsGraph();
    this.props.store.app.setIsSidebarOpen(false);
  };

  render() {
    const { isGraph, isMap } = this.props.store.app;
    return (
      <SideBarContent>
        <Box mb={2} style={{ textAlign: "center", letterSpacing: "1px" }}>
          <h3>
            <a
              style={{ color: "#B31B1B" }}
              href="http://www.cornell.edu/"
              target="_blank"
            >
              Cornell University
            </a>
          </h3>
        </Box>
        <hr />
        <br />
        <Subject size={this.props.size} />
        <State size={this.props.size} />
        <Station size={this.props.size} />
        <DatePicker size={this.props.size} />

        <Box mt={2} mb={2}>
          <Button size="large" icon="environment-o" onClick={this.toggleMap}>
            {isMap ? "Hide Map" : "Display Map"}
          </Button>
        </Box>

        <Box mb={2}>
          <Button size="large" icon="bar-chart" onClick={this.toggleStage}>
            {isGraph ? "Hide Stage" : "Display Stage"}
          </Button>
        </Box>

        <Box mb={2}>
          <Button size="large" icon="bar-chart" onClick={this.toggleGraph}>
            {isGraph ? "Hide Graph" : "Display Graph"}
          </Button>
        </Box>

        <Acknowledgements />
      </SideBarContent>
    );
  }
}

export default SideBar;

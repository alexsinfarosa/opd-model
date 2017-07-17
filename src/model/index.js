import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import takeRight from "lodash/takeRight";
import format from "date-fns/format";
import isAfter from "date-fns/is_after";
// import isWithinRange from "date-fns/is_within_range";
// import { CSVLink } from 'react-csv';

//  reflexbox
import { Flex, Box } from "reflexbox";

// styles
import "styles/shared.styl";

// styled components
import { Value, Info, CSVButton } from "./styles";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";
import Button from "antd/lib/button";
import "antd/lib/button/style/css";
import Spin from "antd/lib/spin";
import "antd/lib/spin/style/css";

import Graph from "./Graph";
import Stage from "components/Stage";

@inject("store")
@observer
export default class Opd extends Component {
  constructor(props) {
    super(props);
    this.props.store.app.setCSVData();
  }
  render() {
    const {
      ACISData,
      station,
      areRequiredFieldsSet,
      isGraph,
      displayPlusButton,
      state,
      isLoading,
      CSVData,
      specie,
      endDate,
      startDateYear,
      currentYear,
      stage
    } = this.props.store.app;
    const { mobile } = this.props;

    const missingDays = () => {
      const idx = ACISData.findIndex(o => o.date === endDate);
      const today = ACISData[idx];
      if (today) return today.missingDays.length;
    };

    const todayCDD = () => {
      const idx = ACISData.findIndex(o => o.date === endDate);
      const today = ACISData[idx];
      if (today) return today.cdd;
    };

    // To display the 'forecast text' and style the cell
    const forecastText = date => {
      return (
        <Flex justify="center" align="center" column>
          <Value>
            {format(date, "MMM D")}
          </Value>
          {startDateYear === currentYear &&
            isAfter(date, endDate) &&
            <Info style={{ color: "red" }}>Forecast</Info>}
        </Flex>
      );
    };

    const description = record => {
      if (record.missingDays.length > 0) {
        return (
          <Flex style={{ fontSize: ".6rem" }} column>
            <Box col={12} lg={6} md={6} sm={12}>
              <Box col={12} lg={12} md={12} sm={12}>
                {record.missingDays.length > 1
                  ? <div>
                      No data available for the following{" "}
                      {record.cumulativeMissingDays} dates:{" "}
                    </div>
                  : <div>No data available for the following date:</div>}
              </Box>
            </Box>
            <br />
            <Box col={12} lg={6} md={6} sm={12}>
              {record.missingDays.map((date, i) =>
                <div key={i}>
                  - {date}
                </div>
              )}
            </Box>
          </Flex>
        );
      }
      return null;
    };

    const columns = [
      {
        title: "Date",
        className: "table",
        dataIndex: "date",
        key: "date",
        render: date => forecastText(date)
      },
      {
        title: "Degree Days (base 50˚F BE)",
        children: [
          {
            title: "Daily",
            className: "table",
            dataIndex: "dd",
            key: "dd"
          },
          {
            title: "Accumulation from January 1st",
            className: "table",
            dataIndex: "cdd",
            key: "cdd"
          }
        ]
      },
      {
        title: "Temperature (˚F)",
        children: [
          {
            title: "Min",
            className: "table",
            dataIndex: "Tmin",
            key: "Tmin"
          },
          {
            title: "Max",
            className: "table",
            dataIndex: "Tmax",
            key: "Tmax"
          },
          {
            title: "Avg",
            className: "table",
            dataIndex: "Tavg",
            key: "Tavg"
          }
        ]
      }
    ];

    const pest = [
      {
        title: "Pest Status",
        className: "table",
        dataIndex: "status",
        key: "status"
      },
      {
        title: "Pest Management",
        className: "table",
        dataIndex: "management",
        key: "management"
      }
    ];

    return (
      <div>
        {!isLoading &&
          <Flex column mt={2} mb={2}>
            <Flex>
              <Box>
                {!mobile
                  ? <h2>
                      <i>{specie.informalName}</i> Results for {" "}
                      <span style={{ color: "#FF934F" }}>
                        {station.name}, {state.postalCode}
                      </span>
                    </h2>
                  : <h3>
                      <i>{specie.informalName}</i> Results for {" "}
                      <span style={{ color: "#FF934F" }}>
                        {station.name}, {state.postalCode}
                      </span>
                    </h3>}
              </Box>
            </Flex>

            <Flex mt={1} justify="center">
              {!isLoading
                ? <Box>
                    <h3>
                      Accumulated degree days (base 50°F) from 01/01/{startDateYear}{" "}
                      through {format(endDate, "MM/DD/YYYY")}: {todayCDD()}
                      {missingDays() !== undefined &&
                        <small>
                          {" "}({` ${missingDays()}`} days missing )
                        </small>}
                    </h3>
                  </Box>
                : <Spin />}
            </Flex>

            <Flex justify="center" column align="center">
              <Box mt={1} col={12} lg={12} md={12} sm={12}>
                {displayPlusButton
                  ? <Table
                      bordered
                      size={mobile ? "small" : "middle"}
                      columns={columns}
                      rowKey={record => record.dateTable}
                      loading={ACISData.length === 0}
                      pagination={false}
                      dataSource={
                        areRequiredFieldsSet ? takeRight(ACISData, 8) : null
                      }
                      expandedRowRender={record => description(record)}
                    />
                  : <Table
                      bordered
                      size={mobile ? "small" : "middle"}
                      columns={columns}
                      rowKey={record => record.dateTable}
                      loading={ACISData.length === 0}
                      pagination={false}
                      dataSource={
                        areRequiredFieldsSet ? takeRight(ACISData, 8) : null
                      }
                    />}
              </Box>
            </Flex>

            <Flex mt={2} justify="space-between" align="baseline">
              <Box>
                <a
                  target="_blank"
                  href={`http://forecast.weather.gov/MapClick.php?textField1=${station.lat}&textField2=${station.lon}`}
                  type="secondary"
                >
                  Forecast Details
                </a>
              </Box>

              <Box ml={2}>
                <Button type="secondary" icon="download">
                  <CSVButton
                    data={CSVData.slice()}
                    filename={"ornamentalPestModel.csv"}
                    target="_blank"
                  >
                    Download CSV
                  </CSVButton>
                </Button>
              </Box>
            </Flex>

            <Flex column>
              <Flex mt={2} justify="center">
                <Stage />
              </Flex>
              <Flex mt={2} mb={2} justify="center">
                The phenological stage above is estimated. Select the actual
                stage and the model will ricalculate recommendation
              </Flex>
              <Flex justify="center">
                <Box mt={2} col={12} lg={8} md={10} sm={11}>
                  <Table
                    bordered
                    size={mobile ? "small" : "middle"}
                    columns={pest}
                    rowKey={record => record}
                    loading={ACISData.length === 0}
                    pagination={false}
                    dataSource={areRequiredFieldsSet ? stage.slice() : null}
                  />
                </Box>
              </Flex>
            </Flex>

            <Flex mt={2} mb={2}>
              <i>
                <em style={{ color: "black" }}>
                  Disclaimer: These are theoretical predictions and forecasts.
                </em>
                The theoretical models predicting pest development or disease
                risk use the weather data collected (or forecasted) from the
                weather station location. These results should not be
                substituted for actual observations of plant growth stage, pest
                presence, and disease occurrence determined through scouting or
                insect pheromone traps.
              </i>
            </Flex>
            {isGraph && <Graph />}
          </Flex>}
      </div>
    );
  }
}

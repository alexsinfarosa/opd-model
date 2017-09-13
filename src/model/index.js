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
      stage,
      isStage,
      startDate
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
          <Value>{format(date, "MMM D")}</Value>
          {startDateYear === currentYear &&
          isAfter(date, endDate) && (
            <Info style={{ color: "red" }}>Forecast</Info>
          )}
        </Flex>
      );
    };

    const description = record => {
      if (record.missingDays.length > 0) {
        return (
          <Flex style={{ fontSize: ".6rem" }} column>
            <Box col={12} lg={6} md={6} sm={12}>
              <Box col={12} lg={12} md={12} sm={12}>
                {record.missingDays.length > 1 ? (
                  <div>
                    No data available for the following{" "}
                    {record.cumulativeMissingDays} dates:{" "}
                  </div>
                ) : (
                  <div>No data available for the following date:</div>
                )}
              </Box>
            </Box>
            <br />
            <Box col={12} lg={6} md={6} sm={12}>
              {record.missingDays.map((date, i) => <div key={i}>- {date}</div>)}
            </Box>
          </Flex>
        );
      }
      return null;
    };

    const month = format(startDate, "MMMM");
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
            title: `Accumulation from ${month} 1st`,
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

    const pestAbove = [
      {
        title: "Status",
        dataIndex: "status",
        width: "50%",
        className: "stage"
      },
      {
        title: "Management",
        dataIndex: "management",
        width: "50%",
        className: "stage"
      }
    ];

    const pestBelow = [
      {
        title: "Scouting",
        dataIndex: "scouting",
        width: "50%",
        className: "stage"
      },
      {
        title: "Phenological Markers",
        dataIndex: "phenologicalMarkers",
        width: "50%",
        className: "stage"
      }
    ];

    return (
      <div>
        {!isLoading && (
          <Flex column mt={2} mb={2}>
            <Flex mb={2}>
              <Box>
                {!mobile ? (
                  <h2>
                    <i>{specie.informalName}</i> results for {" "}
                    <span style={{ color: "#FF934F" }}>
                      {station.name}, {state.postalCode}
                    </span>
                  </h2>
                ) : (
                  <h3>
                    <i>{specie.informalName}</i> results for {" "}
                    <span style={{ color: "#FF934F" }}>
                      {station.name}, {state.postalCode}
                    </span>
                  </h3>
                )}
              </Box>
            </Flex>

            {isStage && (
              <Flex column>
                <Flex mt={2} mb={2} justify="center">
                  <Stage />
                </Flex>
                <Flex mt={2} mb={2} justify="center">
                  The phenological stage above is estimated. Select the actual
                  stage and the model will ricalculate recommendation.
                </Flex>

                <Flex justify="center">
                  <Box mt={2} mb={2} col={12} lg={12} md={12} sm={12}>
                    <Table
                      bordered
                      size={mobile ? "small" : "middle"}
                      columns={pestAbove}
                      rowKey={record => record}
                      loading={ACISData.length === 0}
                      pagination={false}
                      dataSource={areRequiredFieldsSet ? stage.slice() : null}
                    />
                  </Box>
                </Flex>

                <Flex justify="center">
                  <Box mt={2} mb={3} col={12} lg={12} md={12} sm={12}>
                    <Table
                      bordered
                      size={mobile ? "small" : "middle"}
                      columns={pestBelow}
                      rowKey={record => record}
                      loading={ACISData.length === 0}
                      pagination={false}
                      dataSource={areRequiredFieldsSet ? stage.slice() : null}
                    />
                  </Box>
                </Flex>
              </Flex>
            )}

            <Flex mb={2}>
              {!isLoading ? (
                <Box>
                  <h3>
                    Accumulated degree days (base 50°F) from 03/01/{startDateYear}{" "}
                    through {format(endDate, "MM/DD/YYYY")}:{" "}
                    <span style={{ color: "#FF934F" }}>{todayCDD()}</span>
                    {missingDays() !== undefined && (
                      <small> ({` ${missingDays()}`} days missing )</small>
                    )}
                  </h3>
                </Box>
              ) : (
                <Spin />
              )}
            </Flex>

            <Flex justify="center" column align="center">
              <Box mt={1} col={12} lg={12} md={12} sm={12}>
                {displayPlusButton ? (
                  <Table
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
                ) : (
                  <Table
                    bordered
                    size={mobile ? "small" : "middle"}
                    columns={columns}
                    rowKey={record => record.dateTable}
                    loading={ACISData.length === 0}
                    pagination={false}
                    dataSource={
                      areRequiredFieldsSet ? takeRight(ACISData, 8) : null
                    }
                  />
                )}
              </Box>
            </Flex>

            <Flex mt={2} mb={2} justify="space-between" align="baseline">
              <Box>
                <a
                  target="_blank"
                  href={`http://forecast.weather.gov/MapClick.php?textField1=${station.lat}&textField2=${station.lon}`}
                  type="secondary"
                >
                  Forecast Details
                </a>
              </Box>

              {!mobile && (
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
              )}
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
          </Flex>
        )}
      </div>
    );
  }
}

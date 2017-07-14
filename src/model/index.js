import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import format from "date-fns/format";
import subDays from "date-fns/sub_days";

// import takeRight from 'lodash/takeRight';
// import isAfter from 'date-fns/is_after';

import "styles/shared.styl";
import { Flex, Box } from "reflexbox";

import Table from "antd/lib/table";
import "antd/lib/table/style/css";

@inject("store")
@observer
export default class Weed extends Component {
  render() {
    const {
      station,
      state,
      areRequiredFieldsSet,
      endDate
    } = this.props.store.app;
    const { isTable } = this.props.store.logic;
    const { mobile } = this.props;

    //columns for the model
    // const columns = [
    //   {
    //     title: "Species",
    //     dataIndex: "name",
    //     key: "name",
    //     width: 150
    //   },
    //   {
    //     title: "Percent Cumulative Emergence (PCE) from January 1st",
    //     children: [
    //       {
    //         title: `${format(subDays(endDate, 2), "MMM Do")}`,
    //         dataIndex: `indexMinus2`,
    //         key: "indexMinus2",
    //         width: 150
    //       },
    //       {
    //         title: `${format(endDate, "MMMM Do")}`,
    //         dataIndex: "index",
    //         key: "index",
    //         width: 150
    //       },
    //       {
    //         title: "Forecast (currently not available)",
    //         dataIndex: "tomorrow",
    //         key: "tomorrow",
    //         width: 150
    //       }
    //     ]
    //   }
    // ];

    return (
      <div>
        {isTable &&
          <Flex column>
            <Box>
              {!mobile
                ? <h2>
                    Weed species for{" "}
                    <em style={{ color: "#008751" }}>
                      {station.name}, {state.postalCode}
                    </em>
                  </h2>
                : <h3>
                    Weed species for{" "}
                    <em style={{ color: "#008751" }}>
                      {station.name}, {state.postalCode}
                    </em>
                  </h3>}
            </Box>

            {/* <Flex justify="center">
              <Box mt={1} col={12} lg={12} md={12} sm={12}>
                <Table
                  size={mobile ? "small" : "middle"}
                  columns={columns}
                  rowKey={record => record}
                  loading={this.props.store.app.isLoading}
                  pagination={false}
                  dataSource={areRequiredFieldsSet ? specie.slice(-1) : null}
                  onChange={this.handleChange}
                />
              </Box>
            </Flex> */}
          </Flex>}
      </div>
    );
  }
}

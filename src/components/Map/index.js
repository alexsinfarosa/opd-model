import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
// import { toJS } from "mobx";

// styled-components
import { MapContainer } from "./styles";

// reflexbox
import { Flex, Box } from "reflexbox";

const myIcon = e =>
  L.icon({
    iconUrl: e
  });

@inject("store")
@observer
export default class TheMap extends Component {
  onClickSetStation = e => {
    const { lat, lng } = e.latlng;
    const { stations, state, states } = this.props.store.app;
    const selectedStation = stations.find(
      station => station.lat === lat && station.lon === lng
    );

    if (state.name === "All States") {
      this.props.store.app.setStateFromMap(selectedStation.state);
      this.props.store.app.setStation(selectedStation.name);
      this.props.store.app.addIconsToStations();
      // this.props.store.app.loadGridData();
      this.props.store.logic.setIsMap(false);
      return;
    }

    if (selectedStation.state === state.postalCode) {
      this.props.store.app.setStation(selectedStation.name);
      // this.props.store.app.loadGridData();
      this.props.store.logic.setIsMap(false);
    } else {
      const selectedStation = stations.find(
        station => station.lat === lat && station.lon === lng
      );
      const state = states.find(
        state => state.postalCode === selectedStation.state
      );
      alert(`Select ${state.name} from the State menu to access this station.`);
    }
  };
  render() {
    // const position = [this.state.lat, this.state.lng];
    const { stationsWithIcons, state, protocol } = this.props.store.app;
    // const {mobile} = this.props;

    const MarkerList = stationsWithIcons.map(station =>
      <Marker
        key={`${station.id} ${station.network}`}
        // network={station.network}
        position={[station.lat, station.lon]}
        // postalCode={station.state}
        icon={myIcon(station.icon)}
        title={station.name}
        onClick={this.onClickSetStation}
      />
    );

    return (
      <Flex justify="center">
        <Box mb={4} col={12} lg={12} md={12} sm={12}>
          <MapContainer
            zoomControl={true}
            scrollWheelZoom={false}
            ref="map"
            center={
              Object.keys(state).length === 0
                ? [42.9543, -75.5262]
                : [state.lat, state.lon]
            }
            zoom={Object.keys(state).length === 0 ? 6 : state.zoom}
          >
            <TileLayer
              url={`${protocol}//server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}`}
            />
            {MarkerList}
          </MapContainer>
        </Box>
      </Flex>
    );
  }
}

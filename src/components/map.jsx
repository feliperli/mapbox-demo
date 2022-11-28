import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { useMapNavigation } from "../state/useMapNavigation";
import ActionsMenu from "./actionsMenu/index";

export default function MapContainer() {
  const {
    mapContainer,
    lng,
    lat,
    zoom,
    clearParkMarkers,
    canAddMarker,
    toggleCustomMarker,
  } = useMapNavigation();

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <ActionsMenu
        clearParkMarkers={clearParkMarkers}
        canAddMarker={canAddMarker}
        toggleCustomMarker={toggleCustomMarker}
      />
    </div>
  );
}

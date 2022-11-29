import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useEffect, useRef, useState } from "react";
import { getNeighboorhoodMarkers } from "../service/mapNavigationService";

mapboxgl.accessToken = "YOUR KEY HERE";

export const useMapNavigation = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-53);
  const [lat, setLat] = useState(-10);
  const [zoom, setZoom] = useState(4);
  const [selectedNeighboorhoodMarker, setSelectedNeighboorhoodMarker] =
    useState(null);
  const [parkMarkers, setParkerMarkers] = useState([]);
  const [canAddCustomMarker, setCanAddCustomMarker] = useState(false);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: false,
      })
    );
    map.current.addControl(
      new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      })
    );
  }, [map, lat, lng, zoom]);

  useEffect(() => {
    if (!map.current) return;
    //This useEffect handles the actions on the map by creating arrow functions
    const moveHandler = () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    };

    const clickHandler = async (event) => {
      if (canAddCustomMarker && parkMarkers.length === 0) {
        // If canAddCustomMarker is true and we have no parkMarkers, we create a marker for the place that we selected
        const marker = new mapboxgl.Marker()
          .setLngLat([event.lngLat.lng, event.lngLat.lat])
          .addTo(map.current);
        setSelectedNeighboorhoodMarker(marker);

        //We get all the data using the coordinates of the place
        const allFeatures = await getNeighboorhoodMarkers(
          event.lngLat.lng,
          event.lngLat.lat
        );

        //If the request is succeeded we create markers on the map for each park
        if (allFeatures) {
          const allParks = allFeatures.features.reduce(
            (allMarkers, feature) => {
              const marker = new mapboxgl.Marker()
                .setLngLat([
                  feature.geometry.coordinates[0],
                  feature.geometry.coordinates[1],
                ])
                .addTo(map.current);
              return [...allMarkers, marker];
            },
            []
          );
          setParkerMarkers(allParks);
          setCanAddCustomMarker(!canAddCustomMarker);
        }
      }
    };

    //The events are listened by map.current.on
    map.current.on("move", moveHandler);
    map.current.on("click", clickHandler);
    return () => {
      //since canAddCustomMarker state is changed when we click the button, we can prevent bugs by cleaning the event listeners
      //with map.current.off. Otherwise, everytime we click on the button and then click on the map, our function would be executed twice.
      map.current.off("move", moveHandler);
      map.current.off("click", clickHandler);
    };
  }, [map, selectedNeighboorhoodMarker, parkMarkers, canAddCustomMarker]);

  const clearParkMarkers = () => {
    if (parkMarkers.length === 0) return;
    parkMarkers.map((park) => park.remove());
    selectedNeighboorhoodMarker.remove();
    setParkerMarkers([]);
    setSelectedNeighboorhoodMarker(null);
  };

  return {
    mapContainer,
    lat,
    lng,
    zoom,
    clearParkMarkers,
    canAddMarker: Boolean(parkMarkers.length),
    toggleCustomMarker: () => {
      setCanAddCustomMarker(!canAddCustomMarker);
    },
  };
};

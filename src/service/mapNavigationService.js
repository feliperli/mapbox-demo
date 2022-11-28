import axios from "axios";

export const getReverseGeolocationNeighborhoodInfo = async (lng, lat) => {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
  );

  return response.data.features[0].properties.address;
};

export const getNeighboorhoodMarkers = async (lng, lat) => {
  const { state, municipality, suburb } =
    await getReverseGeolocationNeighborhoodInfo(lng, lat);

  const encodedURL = encodeURI(
    `https://nominatim.openstreetmap.org/?addressdetails=1&q=park+in+${state}+${municipality}+${suburb}&format=geojson&limit=50`
  );
  const response = await axios.get(encodedURL);

  return response.data;
};

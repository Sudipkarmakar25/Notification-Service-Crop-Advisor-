import axios from "axios";
import { formatDistrictState } from "../utils/formatLocation.js";

export async function getDistrictAndState(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await axios.get(url, { headers: { "User-Agent": "CropAdvisor/1.0" } });
    const addr = res.data.address || {};
    const district = addr.county || addr.state_district || addr.city || addr.town || addr.village || "unknown";
    const state = addr.state || "unknown";
    return { district, state, formattedLocation: formatDistrictState(district, state) };
  } catch (err) {
    console.error("Geocode error:", err.message);
    return { district: "unknown", state: "unknown", formattedLocation: "unknown" };
  }
}

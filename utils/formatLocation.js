export function formatDistrictState(district, state) {
  const d = (district || "").toString();
  const s = (state || "").toString();
  return (d + s).replace(/\s+/g, "").toLowerCase();
}

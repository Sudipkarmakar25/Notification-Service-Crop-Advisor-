import axios from "axios";

export async function getWeather(lat, lon) {
  try {
    // Example: get current temperature, humidity, precipitation (depends on API)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relativehumidity_2m,temperature_2m,precipitation&current_weather=true&timezone=UTC`;
    const res = await axios.get(url);
    // adapt to the structure returned; this is a simplified example:
    const temperature = res.data.current_weather?.temperature ?? null;
    // humidity and rainfall might be in hourly arrays; for demonstration return placeholders:
    const humidity = null;
    const rainfall = null;
    return { temperature, humidity, rainfall, raw: res.data };
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    return { temperature: null, humidity: null, rainfall: null };
  }
}

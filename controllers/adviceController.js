import Plot from "../models/Plot.Model.js";
import Farmer from "../models/Farmer.Model.js";

import { getDistrictAndState } from "../services/geocodeService.js";
import { getWeather } from "../services/weatherService.js";
import { getAdviceFromEngine } from "../services/adviceService.js";
import { sendAdviceEmail } from "../services/emailService.js";

const DAYS_BETWEEN = 5;
const MIN_DELAY_MS = 0; // 5 minutes

function daysSince(date) {
  if (!date) return Infinity;
  return (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractLatLon(locationString) {
  if (!locationString || typeof locationString !== "string") {
    return { lat: null, lon: null };
  }

  // Extract all numbers (including negatives and decimals)
  const matches = locationString.match(/-?\d+(\.\d+)?/g);

  if (!matches || matches.length < 2) {
    return { lat: null, lon: null };
  }

  const lat = parseFloat(matches[0]);
  const lon = parseFloat(matches[1]);

  // Validate ranges (latitude between -90 and 90, longitude between -180 and 180)
  if (isNaN(lat) || isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return { lat: null, lon: null };
  }

  return { lat, lon };
}


export async function processAllPlotsSequentially() {
  console.log("🚀 Starting daily crop advisory job...");
  const plots = await Plot.find({}).populate("farmerId");

  if (!plots.length) {
    console.log("⚠️ No plots found in the database. Skipping job.");
    return;
  }

  let count = 0;
  for (const plot of plots) {
    count++;
    console.log(`\n[${count}/${plots.length}] Processing plot "${plot.plotName}"`);

    try {
      // 🕐 Skip if advice sent recently
      if (plot.lastSent && daysSince(plot.lastSent) < DAYS_BETWEEN) {
        console.log(`⏩ Skipping (last sent ${plot.lastSent.toDateString()})`);
        continue;
      }

      // 🌍 Extract latitude and longitude
      console.log(plot.location)
      let { lat, lon } = extractLatLon(plot.location);
      plot.latitude = lat;
      plot.longitude = lon;
      console.log("Latitude and Longitude")
           console.log(lat)
           console.log(lon)
      if (!lat || !lon) {
        console.warn(`⚠️ Invalid or missing coordinates for plot "${plot.plotName}" (${plot.location})`);
        continue;
      }

      let farmerLocation="Tripura";
      const geo = await getDistrictAndState(lat, lon);
      if (geo.formattedLocation && geo.formattedLocation !== "unknown") {
        farmerLocation = geo.formattedLocation;
      }

      // 🌦️ Get weather info
      const weather = await getWeather(lat, lon);
      const temperature = weather.temperature ?? 28;
      const humidity = weather.humidity ?? 70;
      const rainfall = weather.rainfall ?? 100;

      // 🧠 Build payload for Flask advice engine
      const flaskPayload = {
        crop: plot.cropName || "unknown",
        location: farmerLocation || "unknown",
        soil: plot.soilType || "unknown",
        temperature,
        humidity,
        rainfall,
        farmer_name: plot.farmerId?.name || "farmer",
        weather: humidity > 80 ? "humid" : humidity < 40 ? "dry" : "normal",
      };

      // 🤖 Call AI advice engine
      const adviceRes = await getAdviceFromEngine(flaskPayload);
      if (!adviceRes || !adviceRes.suggestion) {
        console.warn(`⚠️ No advice for "${plot.plotName}"`);
        continue;
      }

      // 💾 Update DB with new advice
      plot.status = adviceRes.prediction || "healthy";
      plot.message = adviceRes.suggestion;
      plot.lastUpdated = new Date();
      plot.lastSent = new Date();
      await plot.save();

      // 📧 Send email to farmer
      const farmerEmail = plot.farmerId?.email;
      console.log(farmerEmail)
      if (farmerEmail) {
        const subject = `🌾 Crop Advisory: ${plot.cropName} - ${plot.plotName}`;
        const body = `Hello ${plot.farmerId?.name || "Farmer"},\n\nHere is today's advisory for your plot "${plot.plotName}" (${plot.location}):\n\n${adviceRes.suggestion}\n\n— Crop Advisory Team 🌱`;

        await sendAdviceEmail(farmerEmail, subject, body);
        console.log(`✅ Email sent to ${farmerEmail}`);
      } else {
        console.warn(`⚠️ No email for farmer of "${plot.plotName}"`);
      }

    } catch (err) {
      console.error(`❌ Error processing "${plot.plotName}":`, err.message);
    }

    // Wait before next plot
    if (count < plots.length) {
      console.log(`⏳ Waiting ${MIN_DELAY_MS / 60000} minutes before next plot...`);
      await wait(MIN_DELAY_MS);
    }
  }

  console.log("🎉 All plots processed successfully!");
}

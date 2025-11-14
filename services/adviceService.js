import axios from "axios";

export async function getAdviceFromEngine(payload) {
  try {
    const res = await axios.post(
      "https://advisory-generator.onrender.com/suggest",
      payload,
      { timeout: 180000 }
    );
    return res.data;
  } catch (err) {
    console.error("Advice engine error:", err.message);
    throw err;
  }
}

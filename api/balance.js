import fetch from "node-fetch";

export default async function handler(req, res) {
  const { address } = req.query;
  const SIM_API_KEY = process.env.SIM_API_KEY;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  if (!SIM_API_KEY) {
    return res.status(500).json({ error: "API Key missing." });
  }

  const url = `https://api.sim.dune.com/v1/evm/balances/${address}?chain=hyperevm`;

  try {
    const response = await fetch(url, {
      headers: {
        "X-Sim-Api-Key": SIM_API_KEY,
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Failed to fetch balance. Message: ${errorText.substring(0, 100)}...`
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Internal error during balance fetch." });
  }
}

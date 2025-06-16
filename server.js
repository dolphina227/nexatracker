// Memuat variabel lingkungan dari file .env
require("dotenv").config();
const express = require("express");
// Menggunakan 'node-fetch' untuk melakukan permintaan HTTP dari backend
const fetch = require("node-fetch");
// Menggunakan 'cors' untuk mengizinkan permintaan lintas asal dari frontend
const cors = require("cors");

const app = express();
// Mengambil PORT dari variabel lingkungan atau default ke 3000
const PORT = process.env.PORT || 3000;

// Mengambil kunci API dari variabel lingkungan
const SIM_API_KEY = process.env.SIM_API_KEY;

// Mengaktifkan CORS untuk semua permintaan
app.use(cors());
// Melayani file statis dari folder 'public'
// Ini penting agar browser dapat mengakses index.html, CSS, dan JS Anda
app.use(express.static("public"));

// === Tambahan untuk Debugging: Route dasar untuk menguji konektivitas server ===
app.get("/", (req, res) => {
    console.log("[SERVER] Permintaan diterima di root '/'");
    res.send("Server Nexa Wallet berjalan! Akses /index.html untuk aplikasi.");
});
// ==============================================================================

// ✅ Route Token Balance HYPEREVM
app.get("/api/balance", async (req, res) => {
    const address = req.query.address;
    console.log(`[SERVER] Menerima permintaan /api/balance untuk alamat: ${address}`);

    if (!address) {
        console.warn("[SERVER] Peringatan: Alamat tidak disertakan dalam permintaan /api/balance.");
        return res.status(400).json({ error: "Address is required" });
    }

    if (!SIM_API_KEY) {
        console.error("[SERVER] ERROR: SIM_API_KEY tidak ditemukan di .env!");
        return res.status(500).json({ error: "Server configuration error: API Key missing." });
    }

    const url = `https://api.sim.dune.com/v1/evm/balances/${address}?chain=hyperevm`;
    console.log(`[SERVER] Meminta data dari Dune API: ${url}`);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Sim-Api-Key": SIM_API_KEY,
                "Content-Type": "application/json" // Menambahkan header ini mungkin membantu
            },
        });

        if (!response.ok) { // Memeriksa jika respons HTTP adalah OK (status 2xx)
            const errorText = await response.text(); // Ambil teks error jika ada
            console.error(`[SERVER] Kesalahan respons dari Dune API (Status: ${response.status}): ${errorText}`);
            return res.status(response.status).json({
                error: `Failed to fetch balance from external API. Status: ${response.status}. Message: ${errorText.substring(0, 100)}...`
            });
        }

        const data = await response.json();
        console.log("[SERVER] Data BALANCE dari Dune API berhasil diterima:", JSON.stringify(data, null, 2)); // Log data lengkap
        res.json(data);
    } catch (err) {
        console.error("[SERVER] Kesalahan saat mengambil data BALANCE dari Dune API:", err);
        res.status(500).json({ error: "Internal server error during balance fetch." });
    }
});

// ✅ Route NFT Collectibles HYPEREVM
app.get("/api/nfts", async (req, res) => {
    const address = req.query.address;
    console.log(`[SERVER] Menerima permintaan /api/nfts untuk alamat: ${address}`);

    if (!address) {
        console.warn("[SERVER] Peringatan: Alamat tidak disertakan dalam permintaan /api/nfts.");
        return res.status(400).json({ error: "Address is required" });
    }

    if (!SIM_API_KEY) {
        console.error("[SERVER] ERROR: SIM_API_KEY tidak ditemukan di .env!");
        return res.status(500).json({ error: "Server configuration error: API Key missing." });
    }

    const url = `https://api.sim.dune.com/v1/evm/collectibles/${address}?chain=hyperevm`;
    console.log(`[SERVER] Meminta data NFT dari Dune API: ${url}`);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Sim-Api-Key": SIM_API_KEY,
                "Content-Type": "application/json" // Menambahkan header ini mungkin membantu
            },
        });

        if (!response.ok) { // Memeriksa jika respons HTTP adalah OK (status 2xx)
            const errorText = await response.text(); // Ambil teks error jika ada
            console.error(`[SERVER] Kesalahan respons NFT dari Dune API (Status: ${response.status}): ${errorText}`);
            return res.status(response.status).json({
                error: `Failed to fetch NFTs from external API. Status: ${response.status}. Message: ${errorText.substring(0, 100)}...`
            });
        }

        const data = await response.json();
        console.log("[SERVER] Data NFT dari Dune API berhasil diterima:", JSON.stringify(data, null, 2)); // Log data lengkap
        res.json(data);
    } catch (err) {
        console.error("[SERVER] Kesalahan saat mengambil data NFT dari Dune API:", err);
        res.status(500).json({ error: "Internal server error during NFT fetch." });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`Server Nexa Wallet listening on port ${PORT}`);
    console.log(`Akses aplikasi di: http://localhost:${PORT}/index.html`);
    console.log(`Coba akses server langsung di: http://localhost:${PORT}/`);
    if (!SIM_API_KEY) {
        console.error("\n!!! PERINGATAN: SIM_API_KEY tidak ditemukan. Permintaan ke Dune API akan gagal. Pastikan file .env ada dan berisi SIM_API_KEY.\n");
    }
});
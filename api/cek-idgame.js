const axios = require("axios");

module.exports = {
  name: "GameChecker",
  desc: "Cek ID game (Free Fire, ML, PUBG, Genshin)",
  category: "GameChecker",
  path: "/game/check?game=&id=&zone=",
  async run(req, res) {
    const { game, id, zone = "" } = req.query;
    
    // Validasi parameter
    if (!game || !id) {
      return res.json({ 
        code: 400,
        status: false, 
        message: "Missing game or id parameter" 
      });
    }

    // Mapping game ke endpoint
    const endpoints = {
      freefire: "free-fire-indonesia-gp",
      ml: "mobile-legends-mp",
      genshin: "genshin-crystal-dg",
      pubg: "pubg-mobile-global-vc"
    };

    const target = endpoints[game.toLowerCase()];
    
    // Validasi game type
    if (!target) {
      return res.json({ 
        code: 400,
        status: false, 
        message: "Invalid game type. Use: freefire, ml, genshin, or pubg" 
      });
    }

    try {
      // Request ke API eksternal
      const url = `https://cekid-zz.vercel.app/api/game/${target}?id=${encodeURIComponent(id)}&zone=${encodeURIComponent(zone)}`;
      
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.5",
          "Referer": "https://cekid-zz.vercel.app/test"
        }
      });
      
      // Filter response - hanya ambil data penting
      if (data.status && data.data) {
        return res.json({
          code: 200,
          status: true,
          message: "ID Found",
          data: {
            username: data.data.username || "Unknown",
            user_id: data.data.user_id || id,
            zone: data.data.zone || zone || "-"
          }
        });
      } else {
        return res.json({
          code: 404,
          status: false,
          message: data.message || "ID Not Found"
        });
      }
      
    } catch (err) {
      // Handle error
      return res.json({ 
        code: 500,
        status: false, 
        message: "Failed to check game ID",
        error: err.message 
      });
    }
  }
};

const axios = require("axios");

module.exports = {
  name: "GameChecker",
  desc: "Cek ID game (Free Fire, ML, PUBG, Genshin)",
  category: "GameChecker",
  path: "/game/check?game=&id=&zone=",
  async run(req, res) {
    const { game, id, zone = "" } = req.query;
    if (!game || !id) return res.json({ status: false, error: "Missing game or id" });

    const endpoints = {
      freefire: "free-fire-indonesia-gp",
      ml: "mobile-legends-mp",
      genshin: "genshin-crystal-dg",
      pubg: "pubg-mobile-global-vc"
    };

    const target = endpoints[game.toLowerCase()];
    if (!target) return res.json({ status: false, error: "Invalid game type" });

    try {
      const url = `https://cekid-zz.vercel.app/api/game/${target}?id=${encodeURIComponent(id)}&zone=${encodeURIComponent(zone)}`;
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0",
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Referer": "https://cekid-zz.vercel.app/test",
          "Connection": "keep-alive"
        }
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(data));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: false, error: err.message }));
    }
  }
};

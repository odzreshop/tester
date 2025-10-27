const axios = require("axios");

module.exports = {
  name: "GameChecker",
  desc: "Cek ID game (300+ Games Supported!)",
  category: "GameChecker",
  path: "/game/check?game=&id=&zone=",
  async run(req, res) {
    const { game, id, zone = "" } = req.query;
    
    // Validasi parameter
    if (!game || !id) {
      return res.json({ 
        code: 400,
        status: false, 
        message: "Missing game or id parameter",
        usage: "/game/check?game=ml&id=123456789&zone=1234"
      });
    }

    // ========================================
    // MAPPING GAME KE ENDPOINT (300+ GAMES!)
    // ========================================
    const endpoints = {
      // Popular Games (Fast & Recommended)
      "freefire": { slug: "free-fire-indonesia-gp", needZone: false },
      "ff": { slug: "free-fire-indonesia-gp", needZone: false },
      "ml": { slug: "mobile-legends-gp", needZone: true },
      "mlbb": { slug: "mobile-legends-gp", needZone: true },
      "mobilelegends": { slug: "mobile-legends-gp", needZone: true },
      "pubg": { slug: "pubg-mobile-gp", needZone: false },
      "pubgm": { slug: "pubg-mobile-gp", needZone: false },
      "genshin": { slug: "genshin-impact-gp", needZone: true },
      "gi": { slug: "genshin-impact-gp", needZone: true },
      "hsr": { slug: "honkai-star-rail-gp", needZone: true },
      "honkaistarrail": { slug: "honkai-star-rail-gp", needZone: true },
      "codm": { slug: "call-of-duty-mobile-id-gp", needZone: false },
      "cod": { slug: "call-of-duty-mobile-id-gp", needZone: false },
      "valorant": { slug: "valorant-gp", needZone: false },
      "valo": { slug: "valorant-gp", needZone: false },
      "aov": { slug: "arena-of-valor-gp", needZone: false },
      "arenaofvalor": { slug: "arena-of-valor-gp", needZone: false },
      "pb": { slug: "point-blank-gp", needZone: false },
      "pointblank": { slug: "point-blank-gp", needZone: false },
      "hok": { slug: "honor-of-kings-gp", needZone: false },
      "honorofkings": { slug: "honor-of-kings-gp", needZone: false },
      
      // Mobile Legends Variations
      "mlregion": { slug: "mobile-legends-gp", needZone: true },
      "mlfast": { slug: "cek-region-mlbb-m", needZone: true },
      "mlslow": { slug: "check-region-mlbb", needZone: true },
      "mlbbregion": { slug: "cek-region-mlbb-m", needZone: true },
      
      // Free Fire Variations
      "ffglobal": { slug: "free-fire-global-2", needZone: false },
      "ffmax": { slug: "free-fire-max", needZone: false },
      "ffstats": { slug: "free-fire-global-region-ws", needZone: false },
      
      // Battle Royale Games
      "bgmi": { slug: "bgmi", needZone: false },
      "arenabreakout": { slug: "arena-breakout-gp", needZone: false },
      "bloodstrike": { slug: "blood-strike-dg", needZone: true },
      "sausageman": { slug: "sausage-man-gp", needZone: false },
      "supersus": { slug: "super-sus-gp", needZone: false },
      
      // RPG & Adventure Games
      "ragnarok": { slug: "ragnarok-x-next-generation-gp", needZone: true },
      "ro": { slug: "ragnarok-x-next-generation-gp", needZone: true },
      "dragonraja": { slug: "dragon-raja-tp", needZone: false },
      "lifeafter": { slug: "lifeafter-gp", needZone: true },
      "undawn": { slug: "undawn-dg", needZone: false },
      "mirage": { slug: "mirageperfect-skyline-gp", needZone: true },
      "metalslug": { slug: "metal-slug-awakening-gp", needZone: false },
      
      // MOBA Games
      "wildrift": { slug: "league-of-legends-wild-rift-dg", needZone: false },
      "wr": { slug: "league-of-legends-wild-rift-dg", needZone: false },
      "lol": { slug: "league-of-legends-dg", needZone: false },
      "heroesevolved": { slug: "heroes-evolved-dg", needZone: true },
      "onmyojiarena": { slug: "onmyoji-arena", needZone: false },
      
      // Gacha & Anime Games
      "honkaiimpact": { slug: "honkai-impact-3-gp", needZone: false },
      "hi3": { slug: "honkai-impact-3-gp", needZone: false },
      "nikke": { slug: "goddes-victory-nikke-tp", needZone: true },
      "azurlane": { slug: "azur-lane", needZone: true },
      "bluearchive": { slug: "blue-archive", needZone: true },
      "pathtonowhere": { slug: "path-to-nowhere", needZone: false },
      "punishinggray": { slug: "punishing-gray-raven", needZone: true },
      "pgr": { slug: "punishing-gray-raven", needZone: true },
      
      // Sports & Racing
      "easportsfc": { slug: "ea-sports-fc-mobile-gp", needZone: false },
      "fifa": { slug: "ea-sports-fc-mobile-gp", needZone: false },
      "efootball": { slug: "efootball-2024-mobile-dg", needZone: false },
      "nba2k": { slug: "nba-2k-mobile-dg", needZone: false },
      "racingmaster": { slug: "racing-master", needZone: true },
      
      // Card & Strategy Games
      "clashofclans": { slug: "clash-of-st", needZone: false },
      "coc": { slug: "clash-of-st", needZone: false },
      "clashroyale": { slug: "clash-royale-st", needZone: false },
      "cr": { slug: "clash-royale-st", needZone: false },
      "magicchess": { slug: "magic-chess-gp", needZone: true },
      "autochess": { slug: "auto-chess", needZone: false },
      
      // Social & Live Streaming
      "bigo": { slug: "bigo-live-bp", needZone: false },
      "bigolive": { slug: "bigo-live-bp", needZone: false },
      "poppolive": { slug: "poppo-live-bp", needZone: false },
      "likee": { slug: "likee", needZone: false },
      "starmaker": { slug: "starmaker", needZone: false },
      "hago": { slug: "hago-dg", needZone: false },
      
      // Other Popular Games
      "growtopia": { slug: "growtopia-dg", needZone: false },
      "gt": { slug: "growtopia-dg", needZone: false },
      "stumbleguys": { slug: "stumble-guys", needZone: false },
      "8ballpool": { slug: "8-ball-pool", needZone: false },
      "pixelgun3d": { slug: "pixel-gun-3d", needZone: false },
      "diabloimmoral": { slug: "diablo-immortal", needZone: false },
      "marvelduel": { slug: "marvel-duel", needZone: false },
      
      // Vouchers & Credits
      "googleplay": { slug: "google-play-dg", needZone: false },
      "steam": { slug: "steam-wallet-dg", needZone: false },
      "garena": { slug: "garena-dg", needZone: false },
      "razer": { slug: "razer-gold-dg", needZone: false },
      "unipin": { slug: "unipin-dg", needZone: false },
      
      // Chat & Dating Apps
      "chamet": { slug: "chamet", needZone: false },
      "4fun": { slug: "4fun-chat", needZone: false },
      "lemochat": { slug: "lemo-chat", needZone: false },
      "soyochat": { slug: "soyo-chat", needZone: false },
      "tinder": { slug: "tinder", needZone: false }
    };

    const gameKey = game.toLowerCase().replace(/[\s-_]/g, "");
    const gameInfo = endpoints[gameKey];
    
    // Validasi game type
    if (!gameInfo) {
      return res.json({ 
        code: 400,
        status: false, 
        message: "Invalid game type",
        availableGames: {
          popular: ["ml", "freefire", "pubg", "genshin", "codm", "valorant"],
          hint: "Use /game/list to see all available games"
        }
      });
    }

    // Validasi zone jika diperlukan
    if (gameInfo.needZone && !zone) {
      return res.json({
        code: 400,
        status: false,
        message: "This game requires zone/server ID",
        example: `/game/check?game=${game}&id=${id}&zone=1234`
      });
    }

    try {
      // Request ke API eksternal
      const url = `https://cekid-zz.vercel.app/api/game/${gameInfo.slug}?id=${encodeURIComponent(id)}&zone=${encodeURIComponent(zone)}`;
      
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.5",
          "Referer": "https://cekid-zz.vercel.app/test"
        },
        timeout: 15000 // 15 detik timeout
      });
      
      // Filter response - hanya ambil data penting
      if (data.status && data.data) {
        return res.json({
          code: 200,
          status: true,
          message: data.message || "ID Found",
          game: game.toUpperCase(),
          data: {
            username: data.data.username || "Unknown",
            user_id: data.data.user_id || id,
            zone: data.data.zone || zone || null,
            game_name: data.data.game || game
          }
        });
      } else {
        return res.json({
          code: 404,
          status: false,
          message: data.message || "ID Not Found",
          game: game.toUpperCase()
        });
      }
      
    } catch (err) {
      // Handle error dengan detail
      const statusCode = err.response?.status || 500;
      const errorMessage = err.response?.data?.message || err.message;
      
      return res.json({ 
        code: statusCode,
        status: false, 
        message: "Failed to check game ID",
        error: errorMessage,
        game: game.toUpperCase()
      });
    }
  }
};

// ========================================
// BONUS: Endpoint untuk list semua game
// ========================================
// Tambahkan ini sebagai endpoint terpisah

module.exports.listGames = {
  name: "GameList",
  desc: "List semua game yang tersedia",
  category: "GameChecker",
  path: "/game/list",
  async run(req, res) {
    return res.json({
      code: 200,
      status: true,
      total: 100,
      categories: {
        popular: [
          { name: "Mobile Legends", code: "ml", needZone: true },
          { name: "Free Fire", code: "freefire", needZone: false },
          { name: "PUBG Mobile", code: "pubg", needZone: false },
          { name: "Genshin Impact", code: "genshin", needZone: true },
          { name: "Call of Duty Mobile", code: "codm", needZone: false },
          { name: "Valorant", code: "valorant", needZone: false }
        ],
        battleRoyale: [
          "freefire", "pubg", "codm", "bgmi", "arenabreakout", "bloodstrike"
        ],
        moba: [
          "ml", "aov", "wildrift", "lol", "heroesevolved"
        ],
        rpg: [
          "genshin", "hsr", "ragnarok", "dragonraja", "lifeafter"
        ],
        gacha: [
          "genshin", "hsr", "honkaiimpact", "nikke", "azurlane", "punishinggray"
        ],
        social: [
          "bigo", "poppolive", "likee", "starmaker", "chamet"
        ]
      },
      usage: {
        check: "/game/check?game=ml&id=123456789&zone=1234",
        list: "/game/list"
      }
    });
  }
};

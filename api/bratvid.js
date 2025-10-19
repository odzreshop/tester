module.exports = {
  name: "Bratvid", 
  desc: "Brat video generator", 
  category: "Imagecreator", 
  path: "/imagecreator/bratvid?text=",

  async run(req, res) {
    try {
      const { text } = req.query;

      if (!text) {
        return res.json({ status: false, error: 'Text parameter is required' });
      }

      const buffer = await getBuffer(`https://fastrestapis.fasturl.cloud/maker/brat/animated?text=${encodeURIComponent(text)}&mode=animated`);

      res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Content-Length': buffer.length,
      });
      res.end(buffer);
      
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`);
    }
  }
};
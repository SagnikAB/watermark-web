const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const app = express();
const upload = multer();

app.use(express.urlencoded({ extended: true }));

let totalRequests = 0;
const DAILY_LIMIT = 50;

app.post("/", upload.fields([
  { name: "image", maxCount: 1 },
  { name: "logo", maxCount: 1 }
]), async (req, res) => {
  try {
    totalRequests++;
    if (totalRequests > DAILY_LIMIT) {
      return res.status(429).send("❌ Daily usage limit reached");
    }

    const imageFile = req.files?.image?.[0];
    const logoFile = req.files?.logo?.[0];

    if (!imageFile || !imageFile.mimetype.startsWith("image/")) {
      return res.status(400).send("❌ Invalid image");
    }

    const {
      text,
      position = "southeast",
      size = 48,
      opacity = 0.6,
      repeat
    } = req.body;

    let image = sharp(imageFile.buffer);

    // Repeating watermark
    if (repeat === "true" && text) {
      const svg = `
      <svg width="800" height="800">
        <defs>
          <pattern id="p" width="300" height="300"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-45)">
            <text x="0" y="150"
              font-size="${size}"
              fill="white"
              opacity="${opacity}"
              font-family="Arial">
              ${text}
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#p)" />
      </svg>`;
      image = image.composite([{ input: Buffer.from(svg) }]);
    }

    // Normal text watermark
    if (!repeat && text) {
      const svg = `
      <svg width="500" height="200">
        <text x="20" y="120"
          font-size="${size}"
          fill="white"
          opacity="${opacity}"
          font-family="Arial">
          ${text}
        </text>
      </svg>`;
      image = image.composite([
        { input: Buffer.from(svg), gravity: position }
      ]);
    }

    // Logo watermark
    if (logoFile) {
      image = image.composite([
        {
          input: logoFile.buffer,
          gravity: position,
          opacity: Number(opacity)
        }
      ]);
    }

    const output = await image.png().toBuffer();
    res.setHeader("Content-Type", "image/png");
    res.send(output);

  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Server error");
  }
});

module.exports = app;

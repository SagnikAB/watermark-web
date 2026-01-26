const multer = require("multer");
const sharp = require("sharp");

const upload = multer();

// Vercel Serverless Function
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  upload.single("image")(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).send("Upload error");
      }

      if (!req.file) {
        return res.status(400).send("No image uploaded");
      }

      const imageBuffer = req.file.buffer;

      const output = await sharp(imageBuffer)
        .png()
        .toBuffer();

      res.setHeader("Content-Type", "image/png");
      res.status(200).send(output);

    } catch (error) {
      console.error(error);
      res.status(500).send("Image processing failed");
    }
  });
};

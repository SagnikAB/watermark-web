const sharp = require("sharp");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const body = Buffer.concat(buffers);

    // Expect multipart form-data, extract raw image
    const boundary = req.headers["content-type"].split("boundary=")[1];
    const parts = body.toString("binary").split(boundary);

    let imageBuffer = null;

    for (const part of parts) {
      if (part.includes("Content-Type: image")) {
        const start = part.indexOf("\r\n\r\n") + 4;
        const end = part.lastIndexOf("\r\n");
        imageBuffer = Buffer.from(part.slice(start, end), "binary");
        break;
      }
    }

    if (!imageBuffer) {
      return res.status(400).send("No image found");
    }

    const output = await sharp(imageBuffer)
      .png()
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(output);

  } catch (err) {
    console.error(err);
    res.status(500).send("Processing failed");
  }
};

import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Find image bytes (JPEG / PNG)
    const start = buffer.indexOf(Buffer.from([0xff, 0xd8])) !== -1
      ? buffer.indexOf(Buffer.from([0xff, 0xd8]))
      : buffer.indexOf(Buffer.from([0x89, 0x50, 0x4e, 0x47]));

    if (start === -1) {
      return res.status(400).send("Invalid image");
    }

    const imageBuffer = buffer.slice(start);

    const output = await sharp(imageBuffer)
      .png()
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(output);
  } catch (err) {
    console.error(err);
    res.status(500).send("Image processing failed");
  }
}

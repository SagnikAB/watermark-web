import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false
  }
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

    // Detect JPEG or PNG start
    const jpeg = buffer.indexOf(Buffer.from([0xff, 0xd8]));
    const png = buffer.indexOf(Buffer.from([0x89, 0x50, 0x4e, 0x47]));

    const start = jpeg !== -1 ? jpeg : png;
    if (start === -1) {
      return res.status(400).send("Invalid image");
    }

    const imageBuffer = buffer.slice(start);

    const output = await sharp(imageBuffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .png()
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(output);
  } catch (err) {
    console.error(err);
    res.status(500).send("Processing failed");
  }
}

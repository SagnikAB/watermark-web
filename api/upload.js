import sharp from "sharp";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const jpeg = buffer.indexOf(Buffer.from([0xff, 0xd8]));
    const png = buffer.indexOf(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    const start = jpeg !== -1 ? jpeg : png;

    if (start === -1) return res.status(400).send("Invalid image");

    const imageBuffer = buffer.slice(start);

    // Extract text fields manually
    const bodyText = buffer.toString();
    const getValue = (name) => {
      const match = bodyText.match(new RegExp(`${name}"\\r\\n\\r\\n([^\\r\\n]+)`));
      return match ? match[1] : "";
    };

    const text = getValue("text");
    const size = getValue("size") || 48;
    const opacity = getValue("opacity") || 0.6;
    const angle = getValue("angle") || -30;
    const color = getValue("color") || "#ffffff";

    const svg = `
      <svg width="800" height="300">
        <text
          x="50%"
          y="50%"
          dominant-baseline="middle"
          text-anchor="middle"
          font-size="${size}"
          fill="${color}"
          fill-opacity="${opacity}"
          transform="rotate(${angle}, 400, 150)"
          font-family="Arial, Helvetica, sans-serif"
        >
          ${text}
        </text>
      </svg>
    `;

    const output = await sharp(imageBuffer)
      .composite([{ input: Buffer.from(svg), gravity: "center" }])
      .png()
      .toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.status(200).send(output);
  } catch (err) {
    console.error(err);
    res.status(500).send("Watermark failed");
  }
}

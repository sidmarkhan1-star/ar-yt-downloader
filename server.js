const express = require("express");
const youtubedl = require("youtube-dl-exec");

const app = express();

app.get("/", (req, res) => {
  res.send("Server is online");
});

app.get("/download", (req, res) => {
  const url = req.query.url;

  // 1️⃣ Validation
  if (!url) {
    return res.status(400).send("URL required");
  }

  if (!url.includes("tiktok.com")) {
    return res.status(400).send("Only TikTok URLs supported on Railway");
  }

  // 2️⃣ Headers pehle set karo (important)
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="tiktok.mp4"'
  );
  res.setHeader("Content-Type", "video/mp4");

  // 3️⃣ yt-dlp command (simple, fast)
  const { exec } = require("child_process");

  const cmd = `yt-dlp -f mp4 -o - "${url}"`;

  const p = exec(cmd, {
    maxBuffer: 1024 * 1024 * 30, // Railway friendly
    timeout: 60 * 1000           // 60 sec hard stop
  });

  // 4️⃣ Stream output
  p.stdout.pipe(res);

  // 5️⃣ Error handling (VERY IMPORTANT)
  p.stderr.on("data", (data) => {
    console.error("yt-dlp error:", data.toString());
  });

  p.on("error", () => {
    if (!res.headersSent) {
      res.status(500).send("Download failed");
    }
  });

  p.on("close", () => {
    if (!res.writableEnded) {
      res.end();
    }
  });
});
app.get("/ping", (req, res) => {
  res.send("pong");

  // 🔴 Railway ko turant signal do
  res.status(200);
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="video.mp4"'
  );

  try {
    const stream = youtubedl(url, {
      format: "mp4",
      output: "-"
    });
    stream.pipe(res);
  } catch (e) {
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running");
});

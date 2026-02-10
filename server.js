const express = require("express");
const youtubedl = require("youtube-dl-exec");

const app = express();

app.get("/", (req, res) => {
  res.send("Server is online");
});

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

app.get("/download", (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).send("URL required");
  }

  const fileName = `video-${Date.now()}.mp4`;
  const filePath = path.join("/tmp", fileName);

  const command = `yt-dlp -f mp4 -o "${filePath}" "${videoUrl}"`;

  exec(command, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Download failed");
    }

    res.download(filePath, fileName, () => {
      fs.unlink(filePath, () => {});
    });
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

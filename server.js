const express = require("express");
const youtubedl = require("youtube-dl-exec");

const app = express();

app.get("/", (req, res) => {
  res.send("Server is online");
});

import fs from "fs";
import path from "path";
import { exec } from "child_process";

app.get("/download", (req, res) => {
  const videoUrl = req.query.url;
  const format = req.query.format || "mp4"; // default mp4

  if (!videoUrl) {
    return res.status(400).send("URL required");
  }

  if (!["mp4", "mp3"].includes(format)) {
    return res.status(400).send("Invalid format");
  }

  const fileName = `video-${Date.now()}.${format}`;
  const filePath = path.join("/tmp", fileName);

  let command = "";

  if (format === "mp3") {
    command = `yt-dlp -x --audio-format mp3 -o "${filePath}" "${videoUrl}"`;
  } else {
    command = `yt-dlp -f mp4 -o "${filePath}" "${videoUrl}"`;
  }

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

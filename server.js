const express = require("express");
const youtubedl = require("youtube-dl-exec");

const app = express();

app.get("/", (req, res) => {
  res.send("Server is online");
});

app.get("/download", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("URL required");
  app.get("/ping", (req, res) => {
  res.send("pong");
});

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

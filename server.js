const express = require("express");
const youtubedl = require("youtube-dl-exec");

const app = express();

app.get("/", (req, res) => {
  res.send("Server is online");
});

app.get("/download", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("URL required");

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="video.mp4"'
  );

  try {
    const stream = youtubedl(url, {
      format: "mp4",
      output: "-",
    });
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Download error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running");
});

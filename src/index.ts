import express from "express";
import "dotenv/config";
import "./db";

import authRouter from "./routers/auth";

const app = express();

// Register middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

const PORT = process.env.PORT || 8989;

app.listen(PORT, () => {
  console.log("port is listening on " + PORT);
});

// The plan and features
// upload audio files
// listen to single audio
// add to favorites
// create playlist
// remove playlist (public-private)
// remove audios
// many more

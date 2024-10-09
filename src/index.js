const express = require("express");
const axios = require("axios");
const { getRickAndMortyCharactersByPage } = require("./utils.js");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

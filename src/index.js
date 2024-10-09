const express = require("express");
const axios = require("axios");
const {
  getRickAndMortyCharactersByPage,
  getRickAndMortyConversation,
} = require("./utils.js");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/characters", async (req, res) => {
  const { page } = req.query;
  const characters = await getRickAndMortyCharactersByPage(page);
  res.send(characters);
});

app.get("/conversation/:characterId1/:characterId2", async (req, res) => {
  const { characterId1, characterId2 } = req.params;

  const result = await getRickAndMortyConversation(characterId1, characterId2);
  res.send(result);
});

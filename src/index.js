const express = require("express");
const axios = require("axios");
const {
  getRickAndMortyCharactersByPage,
  getRickAndMortyConversation,
  cosa,
} = require("./utils.js");

const app = express();

app.get("/", async (req, res) => {
  const algo = await cosa();
  res.send(JSON.stringify(algo));
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

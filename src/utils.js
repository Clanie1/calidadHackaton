const axios = require("axios");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const PAGESIZE = 5;

const pool = new Pool({
  user: "postgres",
  password: "password",
  host: "localhost",
  port: "5432",
  database: "postgres",
});

pool.connect();

const getRickAndortyConversationCache = async (characterId1, characterId2) => {
  try {
    const res = await pool.query(
      "SELECT * FROM conversation WHERE character_id = $1 AND character2_id = $2",
      [characterId1, characterId2]
    );
    return res.rows[0] || null;
  } catch (err) {
    console.error(err);
    return "";
  }
};

const saveRickAndMortyConversation = async (
  characterId1,
  characterId2,
  conversation
) => {
  try {
    const res = await pool.query(
      "INSERT INTO conversation (character_id, character2_id, text) VALUES ($1, $2, $3) ON CONFLICT (character_id, character2_id) DO NOTHING RETURNING *",
      [characterId1, characterId2, conversation]
    );
    return res.rows[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const getRickAndMortySingleCharacter = async (id) => {
  const response = await axios.get(
    `https://rickandmortyapi.com/api/character/${id}`
  );
  return response.data;
};

const getRickAndMortyChatGPTConversationResult = async (
  character1,
  character2
) => {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Create a short conversation between this two characters, make sure to write their fullnames: ${JSON.stringify(
          character1
        )} and ${JSON.stringify(character2)}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  return response.choices[0].message.content;
};

const getRickAndMortyConversation = async (characterId1, characterId2) => {
  const cache = await getRickAndortyConversationCache(
    characterId1,
    characterId2
  );
  if (cache) {
    console.log("tomado desde el cache");
    return cache.text;
  }

  const character1 = await getRickAndMortySingleCharacter(characterId1);
  const character2 = await getRickAndMortySingleCharacter(characterId2);

  console.log("tomado desde el la api");
  const result = await getRickAndMortyChatGPTConversationResult(
    character1,
    character2
  );

  saveRickAndMortyConversation(characterId1, characterId2, result);

  return result;
};

const getRickAndMortyCharacters = async () => {
  const response = await axios.get("https://rickandmortyapi.com/api/character");
  return response.data.results;
};

const getRickAndMortyCharactersByPage = async (page) => {
  const pageNumber = parseInt(page, 10) || 1;
  const offset = (pageNumber - 1) * PAGESIZE;

  const characters = await getRickAndMortyCharacters();
  const charactersOnPage = characters.slice(offset, offset + PAGESIZE);
  return charactersOnPage;
};

module.exports = {
  getRickAndMortySingleCharacter,
  getRickAndMortyCharactersByPage,
  getRickAndMortyConversation,
  PAGESIZE,
  getRickAndMortyChatGPTConversationResult,
  getRickAndortyConversationCache,
};

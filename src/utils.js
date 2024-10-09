const axios = require("axios");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const PAGESIZE = 5;

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
  const character1 = await getRickAndMortySingleCharacter(characterId1);
  const character2 = await getRickAndMortySingleCharacter(characterId2);

  const result = await getRickAndMortyChatGPTConversationResult(
    character1,
    character2
  );
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
  getRickAndMortyCharactersByPage,
  getRickAndMortyConversation,
  PAGESIZE,
};

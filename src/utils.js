const axios = require("axios");

const PAGESIZE = 5;

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
  PAGESIZE,
};

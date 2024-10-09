const {
  PAGESIZE,
  getRickAndMortyCharactersByPage,
} = require("../src/utils.js");

test("assert that the length of the array is not greater than the page size", async () => {
  const characters = await getRickAndMortyCharactersByPage(1);
  expect(characters.length).toBeLessThanOrEqual(PAGESIZE);
});

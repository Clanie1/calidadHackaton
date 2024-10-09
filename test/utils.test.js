const {
  PAGESIZE,
  getRickAndMortyCharactersByPage,
  getRickAndMortySingleCharacter,
  getRickAndMortyChatGPTConversationResult,
} = require("../src/utils.js");

test("assert that the length of the array is not greater than the page size", async () => {
  const characters = await getRickAndMortyCharactersByPage(1);
  expect(characters.length).toBeLessThanOrEqual(PAGESIZE);
});

test("assert that character has the same id as the one requested", async () => {
  const character = await getRickAndMortySingleCharacter(1);
  expect(character.id).toBe(1);
});

test("assert that the response has the names of the characters", async () => {
  const character1 = { name: "Rick Sanchez" };
  const character2 = { name: "Morty Smith" };

  const conve = await getRickAndMortyChatGPTConversationResult(
    character1,
    character2
  );

  expect(conve).toContain(character1.name);
  expect(conve).toContain(character2.name);
});

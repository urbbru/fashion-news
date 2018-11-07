import { urlTheTitle } from '../lib/constants';

it('it renders the given string in lowercase & replaces spaces with dashes', () => {
  const title = "This is a title"
  expect(urlTheTitle(title)).toBe("this-is-a-title");
})
import { ConvoSpacePage } from './app.po';

describe('convo-space App', () => {
  let page: ConvoSpacePage;

  beforeEach(() => {
    page = new ConvoSpacePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});

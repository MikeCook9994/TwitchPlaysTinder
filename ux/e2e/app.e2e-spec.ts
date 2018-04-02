import { AppPage } from './app.po';

describe('twitch-plays-tinder App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to Twitch Plays Tinder!');
  });
});

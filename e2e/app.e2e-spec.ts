import { ScreenerVersionTwoPage } from './app.po';

describe('screener-version-two App', function() {
  let page: ScreenerVersionTwoPage;

  beforeEach(() => {
    page = new ScreenerVersionTwoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

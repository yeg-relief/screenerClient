import { ScreenerClientPage } from './app.po';

describe('screener-client App', function() {
  let page: ScreenerClientPage;

  beforeEach(() => {
    page = new ScreenerClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

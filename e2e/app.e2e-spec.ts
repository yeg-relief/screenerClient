import { MasterScreenPage } from './app.po';

describe('master-screen App', function() {
  let page: MasterScreenPage;

  beforeEach(() => {
    page = new MasterScreenPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

import { FourinarowPage } from './app.po';

describe('fourinarow App', () => {
  let page: FourinarowPage;

  beforeEach(() => {
    page = new FourinarowPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

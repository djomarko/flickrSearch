import { FlickrSearchPage } from './app.po';

describe('flickr-search App', function() {
  let page: FlickrSearchPage;

  beforeEach(() => {
    page = new FlickrSearchPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

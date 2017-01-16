import { FlickrImage } from './image-class';
import { FlickrImgService } from './flickr-img.service';
import { AppModule } from './app.module';
/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';

declare var $: any;

let fixture: ComponentFixture<AppComponent>;
let app: AppComponent;

let service: FlickrImgService;

const params = {
  css: {
     instr_paragraph : '.no-search-criteria',
     no_results: '.no-results-message',
     searching_indicator: '.searching-indicator-div'
  },
  delay: 301
};

describe('App: FlickrSearch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ]
    });

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    service = fixture.debugElement.injector.get(FlickrImgService);
  });

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it(`should show the instructions paragraph when no search criteria is selected`, () => {
    fixture.detectChanges();
    expect($(params.css.instr_paragraph).length).toBeTruthy();
  });

  it(`should hide the instruction paragraph when a search criteria is entered`, () => {
    app.searchTerm = 'search';
    fixture.detectChanges();
    expect($(params.css.instr_paragraph).length).toBeFalsy();
  });

  it(`should show the instruction paragraph when a search criteria is removed`, () => {
    app.searchTerm = 'search';
    fixture.detectChanges();
    app.searchTerm = '';
    fixture.detectChanges();
    expect($(params.css.instr_paragraph).length).toBeTruthy();
  });

  it(`should show the instruction paragraph when a search criteria is removed`, () => {
    app.searchTerm = 'search';
    fixture.detectChanges();
    app.searchTerm = '';
    fixture.detectChanges();
    expect($(params.css.instr_paragraph).length).toBeTruthy();
  });

  describe('Function: noMatchesFound()', () => {
      it(`should hide the no match div if there is no search criteria selected`, () => {
          app.searchTerm = '';
          app.images = [];
          expect(app.noMatchesFound()).toBeFalsy();
        });

        it(`should hide the no match div if there is images there`, () => {
            app.images = [];
            app.images.push(new FlickrImage());
            app.searchTerm = '';
            fixture.detectChanges();
            expect(app.noMatchesFound()).toBeFalsy();
            expect($(params.css.no_results).length).toBeFalsy();
        });

        it(`should show the no match div if search criteria is selected but nothing is returned`, () => {
          app.images = [];
          app.searchTerm = 'search';
          fixture.detectChanges();
          expect(app.noMatchesFound()).toBeTruthy();
          expect($(params.css.no_results).length).toBeTruthy();
        });

        it('should show the search criteria in the no match div', () => {
          app.images = [];
          app.searchTerm = 'search';
          fixture.detectChanges();
          expect(app.noMatchesFound()).toBeTruthy();
          expect($(params.css.no_results).find(`:contains('search')`).length).toBeTruthy();
        });

        it('should hide the search criteria if currently searching', () => {
          app.images = [];
          app.searchTerm = 'search';
          app.searching = true;
          fixture.detectChanges();
          expect(app.noMatchesFound()).toBeFalsy();
        });

  });
  it(`should show cards depending on the number of images in returned app`, () => {
      setStudImages();

      fixture.detectChanges();
      expect($('.card').length).toBe(4);
  });

  it('should create each card with proper infomation', () => {
      app.images = [];

      let img = new FlickrImage();
      img.mediaUrl = 'jpg';
      img.linkUrl = 'link1';
      img.title = 'title';
      img.author = 'author';
      img.tags = ['tag1', 'tag2'];
      img.dateTaken = new Date(2011, 10, 8);

      app.images.push(img);

      fixture.detectChanges();
      expect($('.card-img-top img').attr('src')).toBe(img.mediaUrl);
      expect($('.card-img-top').attr('href')).toBe(img.linkUrl);
      expect($('.card-title').text()).toBe(img.title);
      expect($(`.card-text:contains('${img.author}')`).length).toBeTruthy();
      expect($(`.card-text :contains('8/11/2011')`).length).toBeTruthy();
      expect($(`.tag`).length).toBe(2);

  });

  it('should test that waiting animation is shown when searching', () => {
    app.searching = true;
    fixture.detectChanges();
    expect($(params.css.searching_indicator).length).toBeTruthy();
  });

  it('should test that waiting animation is hidden when searching', () => {
    app.searching = false;
    fixture.detectChanges();
    expect($(params.css.searching_indicator).length).toBeFalsy();
  });

  describe('Function: onSearch()', () => {

    it('should set searching flag to true when searching with non empty search term', fakeAsync(() => {
      app.searchTerm = 'search';
      spyOn(service, 'search').and.stub();
      app.onSearch();
      tick(params.delay);
      expect(app.searching).toBe(true);
    }));

    it('should set searching flag to false if reseting when searching with empty search term', fakeAsync(() => {
      app.searchTerm = '';
      app.searching = true;
      app.onSearch();
      tick(params.delay);
      expect(app.searching).toBe(false);
    }));

    it('should reset the images if empty search term', fakeAsync(() => {
      setStudImages();
      app.searchTerm = '';
      app.onSearch();
      tick(params.delay);
      expect(app.images.length).toBeFalsy();
    }));

    it('should make sure to rest the service if empty search term is provided', fakeAsync(() => {
      spyOn(service, 'cancel').and.stub();
      app.searchTerm = '';
      app.onSearch();
      tick(params.delay);
      expect(service.cancel).toHaveBeenCalled();
    }));

    it('should make sure to rest the service if empty search term is provided', fakeAsync(() => {
      spyOn(service, 'search').and.stub();
      app.searchTerm = 'test';
      app.onSearch();
      tick(params.delay);
      expect(service.search).toHaveBeenCalledWith('test');
    }));
  });

  function setStudImages(): void {
      app.images = [];
      app.images.push(new FlickrImage());
      app.images.push(new FlickrImage());
      app.images.push(new FlickrImage());
      app.images.push(new FlickrImage());
    }
});

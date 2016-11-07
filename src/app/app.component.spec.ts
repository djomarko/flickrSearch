import { FlickrImage } from './image-class';
import { FlickrImgService } from './flickr-img.service';
import { AppModule } from './app.module';
/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';

declare var $: any;

let fixture: ComponentFixture<AppComponent>;
let app: AppComponent;

let service: FlickrImgService;

const params = {
  css: {
     instr_paragraph : '.no-search-criteria',
     no_results: '.no-results-message'
  }
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

  
  it(`should show the instructions paragraph when no search criteria is selected`, ()=>{
    fixture.detectChanges();
    expect($(params.css.instr_paragraph).length).toBeTruthy();
  });

  it(`should hide the instruction paragraph when a search criteria is entered`, ()=>{
    app.searchTerm = 'search';
    fixture.detectChanges();
    expect($(params.css.instr_paragraph).length).toBeFalsy();
  });

  it(`should show the instruction paragraph when a search criteria is removed`,()=>{
    app.searchTerm = 'search';
    fixture.detectChanges();
    app.searchTerm = '';
    fixture.detectChanges();
    expect($(params.css.instr_paragraph).length).toBeTruthy();
  });

  it(`should hide the no match div if there is no search criteria selected`,()=>{
    app.searchTerm = '';
    app.images = [];
    expect(app.noMatchesFound()).toBeFalsy();
  });

  it(`should hide the no match div if there is images there`,()=>{
      app.images = [];
      app.images.push(new FlickrImage());
      app.searchTerm = '';
      fixture.detectChanges();
      expect(app.noMatchesFound()).toBeFalsy();
      expect($(params.css.no_results).length).toBeFalsy();
  });

  it(`should show the no match div if search criteria is selected but nothing is returned`,()=>{
    app.images = [];
    app.searchTerm = 'search';
    fixture.detectChanges();
    expect(app.noMatchesFound()).toBeTruthy();
    expect($(params.css.no_results).length).toBeTruthy();
  });

  it('should show the search criteria in the no match div', ()=>{
    app.images = [];
    app.searchTerm = 'search';
    fixture.detectChanges();
    expect(app.noMatchesFound()).toBeTruthy();
    expect($(params.css.no_results).find(`:contains('search')`).length).toBeTruthy();
  });

  it(`should show cards depending on the number of images in returned app`,()=>{
      app.images = [];
      app.images.push(new FlickrImage());
      app.images.push(new FlickrImage());
      app.images.push(new FlickrImage());
      app.images.push(new FlickrImage());

      fixture.detectChanges();
      expect($('.card').length).toBe(4);
  });

  it('should create each card with proper infomation',()=>{
      app.images = [];
      
      let img = new FlickrImage();
      img.linkUrl = 'link1';
      img.title = 'title';
      img.author = 'author';
      img.tags = ['tag1', 'tag2'];
      img.publishedDate = new Date(2011,10,8);

      app.images.push(img);

      fixture.detectChanges();
      expect($('.card-img-top').attr('src')).toBe(img.linkUrl);
      expect($('.card-title').text()).toBe(img.title);
      expect($(`.card-text:contains('${img.author}')`).length).toBeTruthy();
      expect($(`.card-text :contains('8/11/2011')`).length).toBeTruthy();
      expect($(`.card-text :contains('8/11/2011')`).length).toBeTruthy();
      expect($(`.tag`).length).toBe(2);

  });

  
 
});

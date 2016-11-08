import { Response } from '@angular/http';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Http, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { FlickrImgService } from './flickr-img.service';

import { AppModule } from './app.module';

describe('Service: FlickerImgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
            return new Http(backend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should ...', inject([FlickrImgService], (flService: FlickrImgService) => {
    expect(flService).toBeTruthy();
  }));

  describe("Function: search", () => {

    function createResponse(flService: FlickrImgService, backend: MockBackend, resp: string) {
      backend.connections.subscribe(c => {
        c.mockRespond(new Response(new ResponseOptions({
          status: 200, body: resp
        })));
      });
      let results = [];
      flService.subscribe(res => results = res);
      flService.search('test');

      return results;
    }

    it('should allow for the images to be searched', inject([FlickrImgService, MockBackend], (flService: FlickrImgService, backend: MockBackend) => {
      expect(flService.search).toBeDefined();

      let results = createResponse(flService, backend, `{
                          "title": "Uploads from everyone",
                          "link": "http://www.flickr.com/photos/",
                          "description": "",
                          "modified": "2016-11-08T01:14:00Z",
                          "generator": "http://www.flickr.com/",
                          "items": [
                          {
                              "title": "Little Kingdom",
                              "link": "https://www.flickr.com/photos/joergbauer/30457411490/",
                              "media": {"m":"https://farm6.staticflickr.com/5597/30457411490_aed2e1c507_m.jpg"},
                              "date_taken": "2016-01-30T13:21:53-08:00",
                              "published": "2016-11-03T18:36:31Z",
                              "author": "nobody@flickr.com (joergbaauer)",
                              "author_id": "51214652@N08",
                              "tags": "nature natur macro makro marko green"
                            },
                            {
                              "title": "IMG_2467.jpg",
                              "link": "https://www.flickr.com/photos/driko/30611612666/",
                              "media": {"m":"https://farm6.staticflickr.com/5579/30611612666_21528e77bd_m.jpg"},
                              "date_taken": "2016-10-28T16:21:23-08:00",
                              "published": "2016-10-29T21:16:18Z",
                              "author": "nobody@flickr.com (driko)",
                              "author_id": "44124400928@N01",
                              "tags": "marko patuxentriver mustangcobra paxriver darius ah1z airshow"
                }]}`);

      expect(results.length).toBe(2);
    }));

    it('should allow for a empty response to be handled', inject([FlickrImgService, MockBackend], (flService: FlickrImgService, backend: MockBackend) => {
        let results = createResponse(flService, backend, `{
                          "title": "Uploads from everyone",
                          "link": "http://www.flickr.com/photos/",
                          "description": "",
                          "modified": "2016-11-08T01:14:00Z",
                          "generator": "http://www.flickr.com/",
                          "items": []}`);
        expect(results.length).toBe(0);
    }));

    it('should allow for bad json to be handled', inject([FlickrImgService, MockBackend], (flService: FlickrImgService, backend: MockBackend) => {
        let results = createResponse(flService, backend, `this is not a json`);
        expect(results.length).toBeFalsy();
    }));
  });

});

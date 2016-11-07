/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FlickrImgService } from './flickr-img.service';

describe('Service: FlickerImgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlickrImgService]
    });
  });

  it('should ...', inject([FlickrImgService], (service: FlickrImgService) => {
    expect(service).toBeTruthy();
  }));
});

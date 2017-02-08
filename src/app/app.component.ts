import { FlickrImgService } from './flickr-img.service';
import { FlickrImage } from './image-class';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  // list of images to show from flickr
  images: FlickrImage[];

  // flag is the app is currently searching for images
  searching = false;
  // search term that is being searched in flickr
  searchTerm: string;

  debounceSearch: NodeJS.Timer;

  constructor(private dataService: FlickrImgService) { }

  public ngOnInit() {
    this.dataService
      .catch(err => this.handleError(err))
      .subscribe(results => {
        this.searching = false;
        this.images = results;
      });
  }

  onSearch(term?: string) {
    // delay the search, by allowing the user to enter the full
    // search term before searching
    const delayTime = 300;
    clearTimeout(this.debounceSearch);

    this.debounceSearch = setTimeout(() => {
      if (term) {
        this.searchTerm = term;
      }
      if (!this.searchTerm) {
        this.searching = false;
        this.dataService.cancel();
        this.images = [];
      } else {
        this.searching = true;
        this.dataService.search(this.searchTerm);
      }
    }, delayTime);

  }

  // flag if the search has returned no images
  noMatchesFound(): boolean {
    return !(this.images && this.images.length) && Boolean(this.searchTerm) && !this.searching;
  }

  // handling an error exception
  private handleError(error: any) {
    this.searching = false;
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    if (console && console.error) {
      console.error(errMsg); // log to console 
    }

    return Observable.throw(errMsg);
  }

  ngOnDestroy() {
    this.dataService.cancel();
  }
}

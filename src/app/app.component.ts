import { FlickrImgService } from './flickr-img.service';
import { FlickrImage } from './image-class';
import { Component, OnInit, OnDestroy } from '@angular/core';

import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  images: FlickrImage[];

  searching = false;
  searchTerm: string;

  debounceSearch: NodeJS.Timer;

  constructor(private dataService: FlickrImgService){}

 public ngOnInit() {

   this.dataService
        .catch(err => this.handleError(err))
        .subscribe(results => {
          this.searching = false;
          this.images = results;
        });

 }

 onSearch(term?: string){
   const delayTime = 300;
   clearTimeout(this.debounceSearch);

   this.debounceSearch = setTimeout(()=>{
     if(term != null)
        this.searchTerm = term;
     if(!this.searchTerm) {
      this.searching = false;
      this.dataService.cancel();
      this.images = [];
    } else {
        this.searching = true;
        this.dataService.search(this.searchTerm);
    }
   }, delayTime);
   
 }

  noMatchesFound(): boolean {
    return !(this.images && this.images.length) && Boolean(this.searchTerm) && !this.searching;
  }


    private handleError(error: any) {
        this.searching = false;
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : "Server error";
        if (console && console.error) {
            console.error(errMsg); // log to console 
        }

        return Observable.throw(errMsg);
    }

    ngOnDestroy() {
        this.dataService.cancel();
    }
}

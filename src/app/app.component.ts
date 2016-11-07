import { FlickrImage } from './image-class';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  images: FlickrImage[];
  searchTerm: string;

  constructor(){
  }

  noMatchesFound(): boolean {
    return !(this.images && this.images.length) && Boolean(this.searchTerm);
  }
}

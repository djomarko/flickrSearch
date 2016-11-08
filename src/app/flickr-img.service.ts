import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import {Subject, Subscription} from "rxjs";

import { FlickrImage } from './image-class';


@Injectable()
export class FlickrImgService extends Subject<FlickrImage[]> {

    
    private _remoteUrl: string;
    private remoteSearch: Subscription;
    private _urlFormater: (term: string) => string = null;

    constructor(private http: Http) {
        super();
    }

    public remoteUrl(remoteUrl: string) {
        this._remoteUrl = remoteUrl;
        return this;
    }

    public urlFormater(urlFormater: (term: string) => string) {
        this._urlFormater = urlFormater;
    }

    /**
     * search Flickr REST services
     */
    public search(term: string): void {
        //adding crossorigin.me to remove the cross domain exceptions
        const URL = "http://crossorigin.me/https://api.flickr.com/services/feeds/photos_public.gne";
        
        let params = new URLSearchParams();
        params.set('tags', term);
        params.set('format', 'json');
        params.set('nojsoncallback', '1');
        params.set('per_page', '50');
        this.cancel();

        this.remoteSearch = this.http.get(URL, {search: params})
            .map((res: Response) => {
                try {
                    let r = JSON.parse(res.text().replace(/\\'/g,"'"));
                    if(r && r.items){
                        return r.items
                    }

                } catch(err){
                    console.log(err);
                }
                 return [];
            })
            .map((data:any[]) => {
                let images = [];
                data.forEach((d)=>{
                   let img = new FlickrImage();
                   img.author = d.author;
                   img.title = d.title;
                   img.mediaUrl = d.media.m;
                   img.linkUrl = d.link;
                   img.dateTaken = new Date(d.date_taken);
                  img.tags = d.tags.split(' ');
                  images.push(img);
                });
                this.next(images);
                return images;
            })
            .catch((err) => {
                this.error(err);
                return null;
            })
            .subscribe();
            
    }

   

    /**
     * stop previous search
     */
    public cancel() {
        if (this.remoteSearch) {
            this.remoteSearch.unsubscribe();
        }
    }
    
}

import { Injectable } from '@angular/core';
import { Jsonp, Response, URLSearchParams } from '@angular/http';
import {Subject, Subscription} from 'rxjs';

import { FlickrImage } from './image-class';


@Injectable()
export class FlickrImgService extends Subject<FlickrImage[]> {

    private remoteSearch: Subscription;

    constructor(private http: Jsonp) {
        super();
    }

    /**
     * search Flickr REST services
     */
    public search(term: string): void {
        // adding crossorigin.me to remove the cross domain exceptions
        const URL = 'https://api.flickr.com/services/feeds/photos_public.gne';
        let params = new URLSearchParams();
        params.set('tags', term);
        params.set('format', 'json');
        params.set('jsoncallback', 'JSONP_CALLBACK');
        this.cancel();

        this.remoteSearch = this.http.get(URL, {search: params})
            .map((res: Response) => {
                const items = res.json().items;
                return items || [];
            })
            .map((data: any[]) => {
                let images = [];
                data.forEach((d) => {
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

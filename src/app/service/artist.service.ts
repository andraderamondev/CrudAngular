import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Artist} from "../model/artist.model";
import { Observable, of } from 'rxjs';

class ObjResp {
    value: Artist[];
}

@Injectable()
export class ArtistService {
    constructor(private http: HttpClient) { }
    baseUrl: string = 'http://xdata.simplesi.com.br:2001/tms/music/Artist';

    getArtists() {
        console.log('Service getArtists');
        return this.http.get<ObjResp>(this.baseUrl+'?$orderby=Name%20asc');
    }

    getArtist(id: number) {
        const url = `${this.baseUrl}(${id})`;
        return this.http.get<Artist>(url);
    }

    async getArtistPromise(id: number){
        return await this.http.get<Artist>(`${this.baseUrl}(${id})`).toPromise();
    }

    createArtist(artist: Artist) {
        console.log(artist);
        return this.http.post(this.baseUrl, artist);
    }

    updateArtist(artist: Artist) {
        console.log(artist);
        const url = `${this.baseUrl}(${artist.Id})`;
        return this.http.put(url, artist);
    }

    deleteArtist(id: number) {
        const url = `${this.baseUrl}(${id})`;
        return this.http.delete(url);
    }
}

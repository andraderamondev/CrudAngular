import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Track } from "../model/track.model";
import { Genre } from "../model/genre.model";
import { Observable, of} from 'rxjs';
import { mergeMap } from 'rxjs/operators';

class ObjResp {
	value: Track[];
}

@Injectable()
export class TrackService {
    tracks: Track[];
    constructor(private http: HttpClient) { }
    baseUrl: string = 'http://xdata.simplesi.com.br:2001/tms/music/Track';

    getTracks() {
        console.log('Service getTrack');
        return this.http.get<ObjResp>(this.baseUrl+'?$orderby=Name%20asc');
    }

    getTrack(id: number) {
        const url = `${this.baseUrl}(${id})`;
        return this.http.get<Track>(url);
    }

    async getTrackPromise(id: number){
        return await this.http.get<Track>(`${this.baseUrl}(${id})`).toPromise();
    }

    createTrack(track: Track) {
        console.log(track);
        return this.http.post(this.baseUrl, track);
    }

    updateTrack(track: Track) {
        console.log(track);
        const url = `${this.baseUrl}(${track.Id})`;
        return this.http.put(url, track);
    }

    deleteTrack(id: number) {
        const url = `${this.baseUrl}(${id})`;
        return this.http.delete(url);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Album } from "../model/album.model";

class ObjResp {
	value: Album[];
}

@Injectable()
export class AlbumService {
    constructor(private http: HttpClient) { }
    baseUrl: string = 'http://xdata.simplesi.com.br:2001/tms/music/Album';

    getAlbums() {
        console.log('Service getAlbum');
        return this.http.get<ObjResp>(this.baseUrl+'?$orderby=Name%20asc');
    }

    getAlbum(id: number) {
        const url = `${this.baseUrl}(${id})`;
        return this.http.get<Album>(url);
    }

    async getAlbumPromise(id: number){
        return await this.http.get<Album>(`${this.baseUrl}(${id})`).toPromise();
    }

    createAlbum(album: Album) {
        console.log(album);
        return this.http.post(this.baseUrl, album);
    }

    updateAlbum(album: Album) {
        console.log(album);
        const url = `${this.baseUrl}(${album.Id})`;
        return this.http.put(url, album);
    }

    deleteAlbum(id: number) {
        const url = `${this.baseUrl}(${id})`;
        return this.http.delete(url);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Genre } from "../model/genre.model";
import { Observable, of } from 'rxjs';

class ObjResp {
	value: Genre[];
}

@Injectable()
export class GenreService {
    constructor(private http: HttpClient) { }
    baseUrl: string = 'http://xdata.simplesi.com.br:2001/tms/music/Genre';

    getGenres() {
        console.log('Service getGenres');
        return this.http.get<ObjResp>(this.baseUrl+'?$orderby=Name%20asc');
    }

    getGenre(id: number) {
        const url = `${this.baseUrl}(${id})`;
        return this.http.get<Genre>(url);
    }

    async getGenrePromise(id: number){
        return await this.http.get<Genre>(`${this.baseUrl}(${id})`).toPromise();
    }

    createGenre(genre: Genre) {
        console.log(genre);
        return this.http.post(this.baseUrl, genre);
    }

    updateGenre(genre: Genre) {
        console.log(genre);
        const url = `${this.baseUrl}(${genre.Id})`;
        return this.http.put(url, genre);
    }

    deleteGenre(id: number) {
        const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url);
    }
}

import {HttpClient, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Gif, SearchGifsResponse} from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
    private _historial : string [] = [];
    private apikey     : string = 'fmiTGPD7Y4YGxVVQOzRMxQ6dG8t4hgzs';
    private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

    public resultados: Gif [] = [];

    get historial(){
        return [...this._historial];
    }

    constructor(private http: HttpClient){
        if(localStorage.getItem('historial')){
            this._historial = JSON.parse(localStorage.getItem('historial')!) ;
            this.resultados = JSON.parse(localStorage.getItem('resultadosEstorage')!);
        }
    }

    buscarGifs( query: string = ''){
    query = query.trim().toLowerCase();
        if ( !this._historial.includes(query) ) {
            this._historial.unshift( query );
            this._historial = this._historial.splice(0, 10);

            localStorage.setItem('historial', JSON.stringify(this._historial));
        }
        const params = new HttpParams()
            .set('api_key', this.apikey)
            .set('limit', '10')
            .set('q', query);

        console.log(params.toString());

        this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{ params })
            .subscribe( (resp) => {
                console.log( resp.data );
                this.resultados = resp.data;
                localStorage.setItem('resultadosEstorage', JSON.stringify(this.resultados));
            });
    }
}

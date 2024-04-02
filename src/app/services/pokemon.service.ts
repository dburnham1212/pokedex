import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BASE_URL = 'https://pokeapi.co/api/v2';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  constructor(private http: HttpClient) { }

  getDetailByUrl(url: string) {
    return this.http.get(url);
  }
 
  getPokemonInfoById(id: number){
    return this.http.get(`${BASE_URL}/pokemon/${id}`);
  }

  getPokemonInfoByName(name: string) {
    return this.http.get(`${BASE_URL}/pokemon/${name}`);
  }

  getPokemonByGeneration(generationNumber: number): Observable<any> {
    return this.http.get(`${BASE_URL}/generation/${generationNumber}`);
  }

  getPokemonGenerations(): Observable<any> {
    return this.http.get(`${BASE_URL}/generation`);
  }

  getBerries(): Observable<any> {
    return this.http.get(`${BASE_URL}/berry`)
  }
}

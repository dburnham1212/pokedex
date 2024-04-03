import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest, concat, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})
export class PokemonComponent {
  generationNumber = 1;
  generations: any | undefined;
  pokemonList = [];
  pokemonDetailedList: Array<any> = [];
  pageSize = 20;
  pageOffset = 0;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];

  pokemonInfoSubscriptions: Array<Observable<Object>> = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemonGenerations();
    this.getPokemonByGeneration(this.generationNumber);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize
    this.pageIndex = e.pageIndex
    this.pageOffset = e.pageIndex * e.pageSize
    this.getPokemonInformation();
  }

  getPokemonByGeneration(newGenerationNumber: number): void {
    this.pokemonService.getPokemonByGeneration(newGenerationNumber).subscribe((result) => {
      console.log("pokemonGenResult", result);
      // Create a number to sort the pokemon by
      let listWithNumber = result.pokemon_species.map((item: any) => {
        const pokemonUrlArr = item.url.split("/");
        const pokemonNumber = pokemonUrlArr[pokemonUrlArr.length - 2]
        return {
          ...item,
          pokemonNumber: parseInt(pokemonNumber)
        }
      })
      // Sort the pokemon based off of their pokedex number
      const sortedPokemon = listWithNumber.sort((a: any, b: any) => {
        if(a.pokemonNumber > b.pokemonNumber) {
          return 1;
        }
        if(a.pokemonNumber < b.pokemonNumber) {
          return -1
        }
        return 0;
      })
      this.generationNumber = newGenerationNumber;
      this.pokemonList = sortedPokemon;
      console.log("sortedPokemon", this.pokemonList);
      this.pageIndex = 0;
      this.pageOffset = 0;
      this.getPokemonInformation();
    });
  }

  ignoreData = false;

  async getPokemonInformation (): Promise<any> {
    let maximumValue = 0;
    if(this.pageOffset + this.pageSize > this.pokemonList.length) {
      maximumValue = this.pokemonList.length;
    } else {
      maximumValue = this.pageOffset + this.pageSize;
    } 
    
    console.log(this.pokemonDetailedList)
    const observableList: Array<Observable<any>> = [];
    for(let i = this.pageOffset; i < maximumValue; i++) {
      observableList.push(this.pokemonService.getPokemonInfoByName(this.pokemonList[i]['name']));
    }
    console.log(this.pokemonDetailedList);
    let newPokemonDetailList: any = []
    concat(...observableList).
    subscribe((result) => {
      newPokemonDetailList.push(result)
    })
    this.pokemonDetailedList = newPokemonDetailList;
  }
  getPokemonGenerations(): void {
    this.pokemonService.getPokemonGenerations().subscribe((result) => {
      this.generations=result.results;
    })
  }
}

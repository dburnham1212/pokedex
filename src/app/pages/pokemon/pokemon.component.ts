import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, concat } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatSelectModule
  ],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})
export class PokemonComponent {
  generationNumber = 1;
  generations: any | undefined;
  pokemonList = [];
  currentPokemonList = [];
  pokemonDetailedList: Array<any> = [];
  pageSize = 20;
  pageOffset = 0;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 20];
  pokemonTypes: any;
  currentType = 'none';
  pokemonTypeInfo: Array<any> = [];
  pokemonByTypeSelection: Array<string> = [];

  pokemonInfoSubscriptions: Array<Observable<Object>> = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemonGenerations();
    this.getPokemonByGeneration(this.generationNumber);    
    this.getPokemonTypes();
  }

  handlePageEvent(e: PageEvent): void {
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
      this.currentPokemonList = sortedPokemon;
      console.log("sortedPokemon", this.pokemonList);
      this.pageIndex = 0;
      this.pageOffset = 0;
      this.getPokemonInformation();
    });
  }

  getPokemonInformation (): void {
    // Filter the pokemon based off of the type selection
    if(this.currentType !== "none"){
      this.currentPokemonList = this.pokemonList.filter((pokemon: any) => {
        return this.pokemonByTypeSelection.includes(pokemon.name);
      })
    } else {
      this.currentPokemonList = this.pokemonList;
    }
    console.log("pokemonList", this.pokemonList)
    let maximumValue = 0;
    if(this.pageOffset + this.pageSize > this.currentPokemonList.length) {
      maximumValue = this.currentPokemonList.length;
    } else {
      maximumValue = this.pageOffset + this.pageSize;
    } 
    
    const observableList: Array<Observable<any>> = [];
    for(let i = this.pageOffset; i < maximumValue; i++) {
      
      observableList.push(this.pokemonService.getPokemonInfoByName(this.currentPokemonList[i]['name']));
    }
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

  getPokemonTypes(): void {
    this.pokemonService.getPokemonTypes().subscribe((result) => {
      this.pokemonTypes=result.results;
      console.log(this.pokemonTypes)
    })
  }

  getPokemonByType(type: string): void {
    this.pokemonService.getTypeInfo(type).subscribe((result) => {
      this.pokemonByTypeSelection = result.pokemon.map((pokemon: any) => {
        return pokemon.pokemon.name;
      })
      console.log(this.pokemonByTypeSelection);
      this.getPokemonInformation();
    });
  }

  onTypeChange(e: MatSelectChange): void {
    this.currentType = e.value;
    if(e.value !== "none") {
      this.getPokemonByType(e.value);
    } else {
      this.getPokemonInformation();
    }
  }
}

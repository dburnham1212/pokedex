import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, Subscription, concat } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './pokemon.component.html',
  styleUrl: './pokemon.component.css'
})

export class PokemonComponent implements OnInit, OnDestroy {
  pokemonByGenerationSubscription!: Subscription;
  pokemonDetailSubscription!: Subscription;
  pokemonGenerationSubscription!: Subscription;
  pokemonTypeSubscription!: Subscription;
  pokemonTypeInfoSubscription!: Subscription;

  generationNumber = 1;
  generations!: any;
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
  pokemonNameSearch: string = "";

  pokemonInfoSubscriptions: Array<Observable<Object>> = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemonGenerations();
    this.getPokemonByGeneration(this.generationNumber);    
    this.getPokemonTypes();
  }

  ngOnDestroy(): void {
    this.pokemonByGenerationSubscription.unsubscribe();
    this.pokemonDetailSubscription.unsubscribe();
    this.pokemonByGenerationSubscription.unsubscribe();
    this.pokemonTypeSubscription.unsubscribe();
    this.pokemonTypeInfoSubscription.unsubscribe();
  }

  getPokemonByGeneration(newGenerationNumber: number): void {
    this.pokemonByGenerationSubscription = this.pokemonService.getPokemonByGeneration(newGenerationNumber).subscribe((result) => {
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
      // set up appropriate lists based off of returned values
      this.generationNumber = newGenerationNumber;
      this.pokemonList = sortedPokemon;
      this.currentPokemonList = sortedPokemon;
      this.getPokemonInformation();
    });
  }

  getPokemonInformation (): void {
    // Set the current pokemon list to the base list to allow filtering
    this.currentPokemonList = this.pokemonList;
    // Filter the pokemon based off of the type selection
    if(this.currentType !== "none"){
      this.currentPokemonList = this.currentPokemonList.filter((pokemon: any) => {
        return this.pokemonByTypeSelection.includes(pokemon.name);
      })
    }
    // Filter the pokemon by by name
    if(this.pokemonNameSearch) {
      this.currentPokemonList = this.currentPokemonList.filter((pokemon: any) => {
        return pokemon.name.includes(this.pokemonNameSearch.toLowerCase());
      })
    }
    // Set up the maximum value, if the max value is less than current offset + page size use it, otherwise use current offset + page size
    let maximumValue = 0;
    if(this.pageOffset + this.pageSize > this.currentPokemonList.length) {
      maximumValue = this.currentPokemonList.length;
    } else {
      maximumValue = this.pageOffset + this.pageSize;
    } 
    // Set up list of observables to get pokemon info
    const observableList: Array<Observable<any>> = [];
    for(let i = this.pageOffset; i < maximumValue; i++) {
      
      observableList.push(this.pokemonService.getPokemonInfoByName(this.currentPokemonList[i]['name']));
    }
    // Set up the new list of pokemon
    let newPokemonDetailList: any = []
    this.pokemonDetailSubscription = concat(...observableList).
    subscribe((result) => {
      newPokemonDetailList.push(result)
    })
    this.pokemonDetailedList = newPokemonDetailList;
  }

  getPokemonGenerations(): void {
    // Get pokemon generations
    this.pokemonByGenerationSubscription = this.pokemonService.getPokemonGenerations().subscribe((result) => {
      this.generations=result.results;
    })
  }

  getPokemonTypes(): void {
    // Get pokemon types
    this.pokemonTypeSubscription = this.pokemonService.getPokemonTypes().subscribe((result) => {
      this.pokemonTypes=result.results;
    })
  }

  getPokemonByType(type: string): void {
    // Get the pokemon names based off of the specific type
    this.pokemonTypeInfoSubscription = this.pokemonService.getTypeInfo(type).subscribe((result) => {
      this.pokemonByTypeSelection = result.pokemon.map((pokemon: any) => {
        return pokemon.pokemon.name;
      })
      this.getPokemonInformation();
    });
  } 
  
  handlePageEvent(e: PageEvent): void {
    // Set page values based off of current page 
    this.pageSize = e.pageSize
    this.pageIndex = e.pageIndex
    this.pageOffset = e.pageIndex * e.pageSize
    // Clear old pokemon list
    this.pokemonDetailSubscription.unsubscribe();
    // Get new Pokemon List
    this.getPokemonInformation();
  }

  onNameChange(e: any):void {
    // Set the name search values based off of input
    this.pokemonNameSearch = e.target.value;
    // Reset page to be first
    this.pageIndex = 0;
    this.pageOffset = 0;
    // Clear old pokemon list
    this.pokemonDetailSubscription.unsubscribe();
    // Get new pokemon list
    this.getPokemonInformation();
  }

  onGenerationChange(e: MatSelectChange):void {
    // Set generation number based off of input
    this.generationNumber = Number(e.value);
    // Reset page to be first
    this.pageIndex = 0;
    this.pageOffset = 0;
    // Clear old pokemon list
    this.pokemonDetailSubscription.unsubscribe();
    // Get new pokemon list
    this.getPokemonByGeneration(this.generationNumber);
  }

  onTypeChange(e: MatSelectChange): void {
    // Set type based off of input
    this.currentType = e.value;
    // Reset page to be first
    this.pageIndex = 0;
    this.pageOffset = 0;
    // Clear old pokemon list
    this.pokemonDetailSubscription.unsubscribe();
    // Get new pokemon list based off of input
    if(e.value !== "none") {
      this.getPokemonByType(e.value);
    } else {
      this.getPokemonInformation();
    }
  }
}

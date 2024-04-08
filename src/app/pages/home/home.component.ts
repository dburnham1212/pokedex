import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PokemonService } from '../../services/pokemon.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  pikachuImageSubscription!: Subscription;
  squirtleImageSubscription!: Subscription;
  bulbasaurImageSubscription!: Subscription;
  charmanderImageSubscription!: Subscription;
  pokeballImageSubscription!: Subscription;

  pikachuImage!: string;
  squirtleImage!: string;
  bulbasaurImage!: string;
  charmanderImage!: string;

  pikachuPokemonImage!: string;
  pokeballItemImage!: string;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemonImages();
  }

  ngOnDestroy(): void {
    this.pikachuImageSubscription.unsubscribe();
    this.squirtleImageSubscription.unsubscribe();
    this.bulbasaurImageSubscription.unsubscribe();
    this.charmanderImageSubscription.unsubscribe();
    this.pokeballImageSubscription.unsubscribe();
  }

  getPokemonImages(): any {
    this.pikachuImageSubscription = this.pokemonService.getPokemonInfoByName("pikachu").subscribe((result: any) => {
      console.log(result);
      this.pikachuImage = result.sprites.versions['generation-v']['black-white'].animated.front_default;
      this.pikachuPokemonImage = result.sprites.other['official-artwork'].front_default;
    })
    
    this.squirtleImageSubscription = this.pokemonService.getPokemonInfoByName("squirtle").subscribe((result: any) => {
      console.log(result);
      this.squirtleImage=result.sprites.versions['generation-v']['black-white'].animated.front_default;
    })

    this.bulbasaurImageSubscription = this.pokemonService.getPokemonInfoByName("bulbasaur").subscribe((result: any) => {
      console.log(result);
      this.bulbasaurImage=result.sprites.versions['generation-v']['black-white'].animated.front_default;
    })

    this.charmanderImageSubscription = this.pokemonService.getPokemonInfoByName("charmander").subscribe((result: any) => {
      console.log(result);
      this.charmanderImage=result.sprites.versions['generation-v']['black-white'].animated.front_default;
    })

    this.pokeballImageSubscription = this.pokemonService.getItemDetails("4").subscribe((result) => {
      console.log(result)
      this.pokeballItemImage = result.sprites.default;
    })
  }
}

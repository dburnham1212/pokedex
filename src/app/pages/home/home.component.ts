import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  pikachuImage: any;
  squirtleImage: any;
  bulbasaurImage: any;
  charmanderImage: any;

  pikachuPokemonImage: any;
  pokeballItemImage: any;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemonImages();
  }

  getPokemonImages(): any {
    this.pokemonService.getPokemonInfoByName("pikachu").subscribe((result: any) => {
      console.log(result);
      this.pikachuImage = result.sprites.versions['generation-v']['black-white'].animated.front_default;
      this.pikachuPokemonImage = result.sprites.other['official-artwork'].front_default;
    })
    
    this.pokemonService.getPokemonInfoByName("squirtle").subscribe((result: any) => {
      console.log(result);
      this.squirtleImage=result.sprites.versions['generation-v']['black-white'].animated.front_default;
    })

    this.pokemonService.getPokemonInfoByName("bulbasaur").subscribe((result: any) => {
      console.log(result);
      this.bulbasaurImage=result.sprites.versions['generation-v']['black-white'].animated.front_default;
    })

    this.pokemonService.getPokemonInfoByName("charmander").subscribe((result: any) => {
      console.log(result);
      this.charmanderImage=result.sprites.versions['generation-v']['black-white'].animated.front_default;
    })

    this.pokemonService.getItemDetails("4").subscribe((result) => {
      console.log(result)
      this.pokeballItemImage = result.sprites.default;
    })
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TypeChipComponent } from '../../components/type-chip/type-chip.component';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    TypeChipComponent
  ],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.css'
})
export class PokemonDetailsComponent implements OnInit{
  @Input() id!:string;

  pokemonInfo: any;
  speciesInfo: any;
  evolutionChain: any;
  typeInfo:any = [];
  flavourText: string | undefined;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemonDetailsById(parseInt(this.id));
  }

  getPokemonDetailsById(id: number): void {
    this.pokemonService.getPokemonInfoById(id).subscribe((result) => {
      this.pokemonInfo = result;
      console.log(result);
      this.getSpeciesInfo(this.pokemonInfo.species.url);
      this.pokemonInfo.types.forEach((type: any) => {
        this.getTypeInfo(type.type.url)
      })
    });
  }

  getSpeciesInfo(url: string): void {
    this.pokemonService.getDetailByUrl(url).subscribe((result) => {
      console.log(result);
      this.speciesInfo = result;
      let newFlavourText = this.speciesInfo.flavor_text_entries[0].flavor_text.split('\f').join(" ");
      this.flavourText = newFlavourText;
      this.getEvolutionChain(this.speciesInfo.evolution_chain.url)
    })
  }

  getTypeInfo(url: string): void {
    this.pokemonService.getDetailByUrl(url).subscribe((result) => {
      console.log("typeInfo", result);
      this.typeInfo.push(result);
    })
  }

  getEvolutionChain(url: string): void {
    this.pokemonService.getDetailByUrl(url).subscribe((result) => {
      console.log(result);
    })
  }
}

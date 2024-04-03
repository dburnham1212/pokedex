import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TypeChipComponent } from '../../components/type-chip/type-chip.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription, firstValueFrom } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    TypeChipComponent,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.css'
})
export class PokemonDetailsComponent implements OnInit, OnDestroy{
  pokemonInfoSubscription!: Subscription;
  pokemonInfo: any;
  speciesInfo: any;
  typeInfo:any = [];
  flavourText: string | undefined;
  evolutionStages: Array<any> = [];
  pokemonId!: string;
  learnedMoves!: Array<any>;

  constructor(private pokemonService: PokemonService, private router: ActivatedRoute ) {
    router.params.subscribe((routeParams) => {
      //console.log(val)
      this.pokemonId = routeParams['id'];
      this.evolutionStages=[];
      this.typeInfo=[];
      this.getPokemonDetailsById(parseInt(this.pokemonId));
      window.scroll({ 
        top: 0, 
        left: 0, 
      });
    })
    
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.pokemonInfoSubscription.unsubscribe();
  }

  getPokemonDetailsById(id: number): void {
    this.pokemonInfoSubscription = this.pokemonService.getPokemonInfoById(id).subscribe((result) => {
      this.pokemonInfo = result;
      console.log(result);
      this.getSpeciesInfo(this.pokemonInfo.species.url);
      this.getLearnedMoves();
      this.pokemonInfo.types.forEach((type: any) => {
        this.getTypeInfo(type.type.url)
      })
    });
  }

  getSpeciesInfo(url: string): void {
    this.pokemonService.getDetailByUrl(url).subscribe((result) => {
      console.log(result);
      this.speciesInfo = result;
      let newFlavourText = this.speciesInfo.flavor_text_entries.find((text_entry: any) => {
        return text_entry.language.name === 'en'
      }).flavor_text.split('\f').join(" ");
      
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
    this.pokemonService.getDetailByUrl(url).subscribe(async (result: any) => {
      console.log("evolution chain", result);
      let evoData: any = result.chain;
      let stage = 0;
      do {
        let numberOfEvolutions = evoData['evolves_to'].length;  
        if(evoData.species) {
          await firstValueFrom(this.pokemonService.getPokemonInfoByName(evoData.species.name))
              .then((result: any) => {
                if(!this.evolutionStages[stage]) {
                  this.evolutionStages[stage]=[];
                }
                this.evolutionStages[stage].push({
                  species: evoData.species, speciesInfo: result});
              }
            );
        }
        stage++;
        if(numberOfEvolutions > 1) {
          for (let i = 1;i < numberOfEvolutions; i++) { 
            await firstValueFrom(this.pokemonService.getPokemonInfoByName(evoData.evolves_to[i].species.name))
              .then((result: any) => {
                if(!this.evolutionStages[stage]) {
                  this.evolutionStages[stage] = [];
                }
                this.evolutionStages[stage].push({
                  species: evoData.evolves_to[i].species, speciesInfo: result});
              }
            );
          }
        }       
        evoData = evoData['evolves_to'][0];
      
      } while (!!evoData && evoData.hasOwnProperty('evolves_to'));
      console.log(this.evolutionStages)
    })
  }

  getLearnedMoves() {
    this.learnedMoves = this.pokemonInfo.moves.map((move: any) => {
      return {
        moveName: move.move.name,
        learnedMoveInfo: move.version_group_details.find((version_group_detail: any) => {
          return version_group_detail.move_learn_method.name === 'level-up'
        })
      }
    }).filter((move: any) => {return move.learnedMoveInfo });

    for(let move of this.learnedMoves) {
      let newMoveName = move.moveName.split("-");
      for(let i = 0; i < newMoveName.length; i++) {
        newMoveName[i] = newMoveName[i].charAt(0).toUpperCase() + newMoveName[i].slice(1);
      }
      move.moveName = newMoveName.join(" ")
    }

    this.learnedMoves.sort((a: any, b: any) => {
      if(a.learnedMoveInfo.level_learned_at > b.learnedMoveInfo.level_learned_at) {
        return 1;
      }
      if(a.learnedMoveInfo.level_learned_at < b.learnedMoveInfo.level_learned_at) {
        return -1;
      }
      return 0;
    })
    console.log("moves",this.learnedMoves)
  }
}

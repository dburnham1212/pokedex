import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TypeChipComponent } from '../../components/type-chip/type-chip.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription, firstValueFrom } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DamageRelationDisplayComponent } from './components/damage-relation-display/damage-relation-display.component';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TypeChipComponent,
    DamageRelationDisplayComponent,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.css'
})
export class PokemonDetailsComponent implements OnInit, OnDestroy{
  pokemonInfoSubscription!: Subscription;
  speciesInfoSubscription!: Subscription;
  evolutionInfoSubscription!: Subscription;
  typeInfoSubscription!: Subscription;

  pokemonInfo: any;
  speciesInfo: any;
  typeInfo:any = [];
  flavourText: string | undefined;
  evolutionStages: Array<any> = [];
  pokemonId!: string;
  learnedMoves!: Array<any>;

  constructor(private pokemonService: PokemonService, private router: ActivatedRoute ) {
    router.params.subscribe((routeParams) => {
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
    this.speciesInfoSubscription.unsubscribe();
    this.evolutionInfoSubscription.unsubscribe();
    this.typeInfoSubscription.unsubscribe();
  }

  getPokemonDetailsById(id: number): void {
    this.pokemonInfoSubscription = this.pokemonService.getPokemonInfoById(id).subscribe((result) => {
      this.pokemonInfo = result;
      this.getSpeciesInfo(this.pokemonInfo.species.url);
      this.getLearnedMoves();
      this.pokemonInfo.types.forEach((type: any) => {
        this.getTypeInfo(type.type.url)
      })
    });
  }

  getSpeciesInfo(url: string): void {
    this.speciesInfoSubscription = this.pokemonService.getDetailByUrl(url).subscribe((result) => {
      this.speciesInfo = result;
      // Find the first entry in english and format it for readability
      let newFlavourText = this.speciesInfo.flavor_text_entries.find((text_entry: any) => {
        return text_entry.language.name === 'en'
      }).flavor_text.split('\f').join(" ");
      
      this.flavourText = newFlavourText;
      this.getEvolutionChain(this.speciesInfo.evolution_chain.url)
    })
  }

  getTypeInfo(url: string): void {
    this.typeInfoSubscription = this.pokemonService.getDetailByUrl(url).subscribe((result) => {
      this.typeInfo.push(result);
    })
  }

  getEvolutionChain(url: string): void {
    this.evolutionInfoSubscription = this.pokemonService.getDetailByUrl(url).subscribe(async (result: any) => {
      let evoData: any = result.chain;
      let stage = 0;
      // Loop through to get the evolution data for the chosen pokemon
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
    })
  }

  getLearnedMoves() {
    // Get the learned move info from the db
    this.learnedMoves = this.pokemonInfo.moves.map((move: any) => {
      return {
        moveName: move.move.name,
        learnedMoveInfo: move.version_group_details.find((version_group_detail: any) => {
          return version_group_detail.move_learn_method.name === 'level-up'
        })
      }
    }).filter((move: any) => {return move.learnedMoveInfo });

    // Alter the move list so it is in a more readale format
    for(let move of this.learnedMoves) {
      let newMoveName = move.moveName.split("-");
      for(let i = 0; i < newMoveName.length; i++) {
        newMoveName[i] = newMoveName[i].charAt(0).toUpperCase() + newMoveName[i].slice(1);
      }
      move.moveName = newMoveName.join(" ")
    }

    // Sort the learned moves based off of the level learned
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

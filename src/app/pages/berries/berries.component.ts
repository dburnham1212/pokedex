import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-berries',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule
  ],
  templateUrl: './berries.component.html',
  styleUrl: './berries.component.css'
})
export class BerriesComponent implements OnInit{
  berriesList: any;
  berriesInfoList: any = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getBerries();
  }

  getBerries(): void {
    this.pokemonService.getBerries().subscribe((result) => {
      console.log("berry info", result);
      this.berriesList = result.results;
      this.getBerryInfo();
    })
  }

  getBerryInfo(): void {
    for(let i = 0; i < this.berriesList.length; i++) {
      this.pokemonService.getDetailByUrl(this.berriesList[i].url).subscribe((result: any) => {
        this.pokemonService.getDetailByUrl(result.item.url).subscribe((result) => {
          console.log(result);
          this.berriesInfoList.push(result);
        });
      })
    } 
  }
}

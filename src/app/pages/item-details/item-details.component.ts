import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.css'
})
export class ItemDetailsComponent implements OnInit{
  constructor (private pokemonService: PokemonService, private router: ActivatedRoute) {}

  itemId!: string;
  itemInfo: any;
  flavourText!: string;

  ngOnInit(): void {
    this.router.params.subscribe((routeParams) => {
      this.itemId = routeParams['itemId'];
      this.getItemDetails(this.itemId);
      
    });
  }

  getItemDetails(id:string): void {
    this.pokemonService.getItemDetails(id).subscribe((result) => {
      console.log(result);
      this.itemInfo = result;
      this.getFlavourText();
    })
  }

  getFlavourText(): void {
    let newFlavourText = this.itemInfo.flavor_text_entries.find((text_entry: any) => {
      return text_entry.language.name === 'en'
    }).text.split('\f').join(" ");
    
    this.flavourText = newFlavourText;
  }
}

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
  itemAttributes!: any;

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
      // Altering title to be a more readable format
      let itemNameArr = this.itemInfo.name.split("-");
      for(let i = 0; i < itemNameArr.length; i++){
        itemNameArr[i] = itemNameArr[i].charAt(0).toUpperCase() + itemNameArr[i].slice(1);
      }      
      this.itemInfo.name = itemNameArr.join(" ")
      this.getFlavourText();
      this.getItemAttributes();
    })
  }

  getFlavourText(): void {
    let newFlavourText = this.itemInfo.flavor_text_entries.find((text_entry: any) => {
      return text_entry.language.name === 'en'
    }).text.split('\f').join(" ");
    
    this.flavourText = newFlavourText;
  }

  getItemAttributes() : void {
    let newItemAttributes: any = [];
    for(let attribute of this.itemInfo.attributes) {
      this.pokemonService.getDetailByUrl(attribute.url).subscribe((result: any) => {
        // Altering attribute name to be a more readable format
        let newNameArr = result.name.split("-")
        for(let i = 0; i < newNameArr.length; i++) {
          newNameArr[i] = newNameArr[i].charAt(0).toUpperCase() + newNameArr[i].slice(1);
        }
        newItemAttributes.push({
          name: newNameArr.join(" "),
          description: result.descriptions.find((description: any) => {
            return description.language.name === 'en'
          }).description
        });
      })
    } 
    this.itemAttributes = newItemAttributes;
    console.log(this.itemAttributes)
  }
}

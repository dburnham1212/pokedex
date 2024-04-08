import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subscription, concat } from 'rxjs';

interface ItemAttribute {
  name: string;
  description: string;
}

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-details.component.html',
  styleUrl: './item-details.component.css'
})
export class ItemDetailsComponent implements OnInit, OnDestroy{
  itemDetailsSubscription!: Subscription;
  itemAttributeSubscription!: Subscription;

  itemId!: string;
  itemInfo: any;
  flavourText!: string;
  itemAttributes!: Array<ItemAttribute>;
  
  constructor (private pokemonService: PokemonService, private router: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.params.subscribe((routeParams) => {
      this.itemId = routeParams['itemId'];
      this.getItemDetails(this.itemId);
    });
  }

  ngOnDestroy(): void {
    this.itemDetailsSubscription.unsubscribe();
    this.itemAttributeSubscription.unsubscribe();
  }

  getItemDetails(id:string): void {
    this.itemDetailsSubscription = this.pokemonService.getItemDetails(id).subscribe((result) => {
      console.log(result);
      this.itemInfo = result;
      // Altering title to be a more readable format
      let itemNameArr = this.itemInfo.name.split("-");
      for(let i = 0; i < itemNameArr.length; i++){
        itemNameArr[i] = itemNameArr[i].charAt(0).toUpperCase() + itemNameArr[i].slice(1);
      }      
      this.itemInfo.name = itemNameArr.join(" ")

      // Altering fling effect to be a more readable format
      if(this.itemInfo.fling_effect) {
        let newFlingEffectArr = this.itemInfo.fling_effect.name.split("-");
        for(let i = 0; i < newFlingEffectArr.length; i++) {
          newFlingEffectArr[i] = newFlingEffectArr[i].charAt(0).toUpperCase() + newFlingEffectArr[i].slice(1);
        }
        this.itemInfo.fling_effect.name = newFlingEffectArr.join(" ");
      }

      // Altering category to be a more readable format
      if(this.itemInfo.category) {
        let newCategoryNameArr = this.itemInfo.category.name.split("-");
        for(let i = 0; i < newCategoryNameArr.length; i++) {
          newCategoryNameArr[i] = newCategoryNameArr[i].charAt(0).toUpperCase() + newCategoryNameArr[i].slice(1);
        }
        this.itemInfo.category.name = newCategoryNameArr.join(" ");
      }

      this.getFlavourText();
      this.getItemAttributes();
    })
  }

  getFlavourText(): void {
    // Format flavour text to be of a more readable format in english
    let newFlavourText = this.itemInfo.flavor_text_entries.find((text_entry: any) => {
      return text_entry.language.name === 'en'
    }).text.split('\f').join(" ");

    this.flavourText = newFlavourText;
  }

  getItemAttributes() : void {
    // Set up a list of observables
    const observableList: Array<Observable<any>> = [];
    for(let attribute of this.itemInfo.attributes) {
      observableList.push(this.pokemonService.getDetailByUrl(attribute.url));
    }

    // Create a new list to store item attributes
    let newItemAttributes: Array<ItemAttribute> = [];
    this.itemAttributeSubscription = concat(
      ...observableList
    )
    .subscribe((result: any) => {
      // Altering attribute name to be a more readable format
      let newNameArr = result.name.split("-")
      for(let i = 0; i < newNameArr.length; i++) {
        newNameArr[i] = newNameArr[i].charAt(0).toUpperCase() + newNameArr[i].slice(1);
      }
      
      // Push values to new item attributes
      newItemAttributes.push({
        name: newNameArr.join(" "),
        description: result.descriptions.find((description: any) => {
          return description.language.name === 'en'
        }).description
      });
    })
    this.itemAttributes = newItemAttributes;
    console.log(this.itemAttributes)
  }
}

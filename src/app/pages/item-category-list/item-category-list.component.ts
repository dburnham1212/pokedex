import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-item-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule
  ],
  templateUrl: './item-category-list.component.html',
  styleUrl: './item-category-list.component.css'
})
export class ItemCategoryListComponent implements OnInit {
  constructor (private pokemonService: PokemonService, private router: ActivatedRoute) {

  }

  categoryId!: string;
  itemList!: Array<any>;
  categoryTitle!: string;
  
  ngOnInit(): void {    
    this.router.params.subscribe((routeParams) => {
      this.categoryId = routeParams['id'];
      this.pokemonService.getItemsByCategory(this.categoryId).subscribe((result) => {
        console.log(result);
        let newCategoryTitleArr = result.name.split("-");
        for(let i = 0; i < newCategoryTitleArr.length; i++) {
          newCategoryTitleArr[i] = newCategoryTitleArr[i].charAt(0).toUpperCase() + newCategoryTitleArr[i].slice(1);
        }

        this.categoryTitle = newCategoryTitleArr.join(" ");
        this.itemList=result.items;
        this.getCategoryItems();
      });
    });
  }

  getCategoryItems(): void {
    for(let i = 0; i < this.itemList.length; i++) {
      this.pokemonService.getDetailByUrl(this.itemList[i].url).subscribe((result: any) => {
        this.itemList[i] = {
          ...this.itemList[i],
          image: result.sprites.default,
          id: result.id
        }
      });
      
      let newNameArr = this.itemList[i].name.split("-");
      for(let j = 0; j < newNameArr.length; j++) {
        newNameArr[j] = newNameArr[j].charAt(0).toUpperCase() + newNameArr[j].slice(1);
      }
      this.itemList[i].name = newNameArr.join(" ")
    }
    console.log(this.itemList);
  }
}

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
        this.categoryTitle = result.name;
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
      
    }
    console.log(this.itemList);
  }
}

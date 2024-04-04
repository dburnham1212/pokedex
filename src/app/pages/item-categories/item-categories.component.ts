import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-item-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './item-categories.component.html',
  styleUrl: './item-categories.component.css'
})
export class ItemCategoriesComponent implements OnInit{
  constructor (private pokemonService: PokemonService) {}

  itemCategories: any;

  ngOnInit(): void {
    this.getItemCategories();
  }

  getItemCategories() {
    this.pokemonService.getItemCategories().subscribe((result) => {
      let formattedCategoryResults = [];
      for(let category of result.results) {
        let categoryUrlArr = category.url.split("/");
        let categoryId = categoryUrlArr[categoryUrlArr.length - 2];

        let categoryNameArr = category.name.split("-");
        for(let i = 0; i < categoryNameArr.length; i++) {
          categoryNameArr[i] = categoryNameArr[i].charAt(0).toUpperCase() + categoryNameArr[i].slice(1);
        }
        let categoryName = categoryNameArr.join(" ");

        formattedCategoryResults.push({
          name: categoryName,
          id: categoryId
        })
      }
      this.itemCategories = formattedCategoryResults;
    })
  }
}

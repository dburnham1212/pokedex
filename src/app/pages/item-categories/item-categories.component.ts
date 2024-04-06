import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-item-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    MatFormFieldModule
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

        // Alter category names to be of a more readable format
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
      this.sortCategoriesAsc();
    })
  }

  // Change sorting based off of selection value
  onSortCategories(e: MatSelectChange): void {
    if(e.value === "asc") {
      this.sortCategoriesAsc();
    } else {
      this.sortCategoriesDesc();
    }
  }

  // Sort item categories in ascending order
  sortCategoriesAsc(): void {
    this.itemCategories = this.itemCategories.sort((a: any, b: any) => {
      if(a.name > b.name) {
        return 1;
      }
      if(a.name < b.name) {
        return -1;
      }
      return 0;
    })
  }

  // Sort item categories in descending order
  sortCategoriesDesc(): void {
    this.itemCategories = this.itemCategories.sort((a: any, b: any) => {
      if(a.name < b.name) {
        return 1;
      }
      if(a.name > b.name) {
        return -1;
      }
      return 0;
    })
  }
}

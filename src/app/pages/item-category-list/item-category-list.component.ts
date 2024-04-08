import { Component, OnDestroy, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Observable, Subscription, concat } from 'rxjs';


@Component({
  selector: 'app-item-category-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatPaginatorModule
  ],
  templateUrl: './item-category-list.component.html',
  styleUrl: './item-category-list.component.css'
})
export class ItemCategoryListComponent implements OnInit, OnDestroy {
  categoryItemsSubscription!: Subscription; 
  itemListSubscription!: Subscription;
  
  categoryId!: string;
  itemList: Array<any> = [];
  itemListToDisplay!: Array<any>;
  categoryTitle!: string;
  pageSize = 20;
  pageIndex = 0;
  pageOffset = 0;
  pageSizeOptions = [5, 10, 20];

  constructor (private pokemonService: PokemonService, private router: ActivatedRoute) {

  }
  
  ngOnInit(): void {    
    this.router.params.subscribe((routeParams) => {
      this.categoryId = routeParams['id'];
      this.getItemsByCategory(this.categoryId);
    });
  }

  ngOnDestroy(): void {
    this.categoryItemsSubscription.unsubscribe();
    this.itemListSubscription.unsubscribe();
  }
  
  getItemsByCategory(id: string): void {
    this.categoryItemsSubscription = this.pokemonService.getItemsByCategory(id).subscribe((result) => {
      // Alter category title to be a more readable format
      let newCategoryTitleArr = result.name.split("-");
      for(let i = 0; i < newCategoryTitleArr.length; i++) {
        newCategoryTitleArr[i] = newCategoryTitleArr[i].charAt(0).toUpperCase() + newCategoryTitleArr[i].slice(1);
      }
  
      this.categoryTitle = newCategoryTitleArr.join(" ");
      this.itemList=result.items;
      this.getCategoryItems();
    });
  }

  getCategoryItems(): void {
    let maximumValue = 0;
    // Check if we have reached the end of the list, if so use the list size, if not use the offset and page size values
    if(this.pageOffset + this.pageSize > this.itemList.length) {
      maximumValue = this.itemList.length;
    } else {
      maximumValue = this.pageOffset + this.pageSize;
    } 
    // Set up a list of observables to pull values from API
    const observableList: Array<Observable<any>> = [];
    for(let i = this.pageOffset; i < maximumValue; i++) {
      observableList.push(this.pokemonService.getDetailByUrl(this.itemList[i].url));
    }
    // Reset the items to display
    let newItemListToDisplay: Array<any> = [];
    // Build the list of items to display
    this.itemListSubscription = concat(
      ...observableList
    )
    .subscribe((result: any) => {
      // Altering names of items to make them more readable
      let newNameArr = result.name.split("-");
      for(let j = 0; j < newNameArr.length; j++) {
        newNameArr[j] = newNameArr[j].charAt(0).toUpperCase() + newNameArr[j].slice(1);
      }
      // Push the necessary values to the display array
      newItemListToDisplay.push({
        name: newNameArr.join(" "),
        image: result.sprites.default,
        id: result.id
      })
    });
    this.itemListToDisplay = newItemListToDisplay;
  }

  // Handle page changes
  handlePageEvent(e: PageEvent): void {
    // Set up page values
    this.pageSize = e.pageSize
    this.pageIndex = e.pageIndex
    this.pageOffset = e.pageIndex * e.pageSize
    // Unsubscribe from the previous subscription
    this.itemListSubscription.unsubscribe();
    // Set up new items
    this.getCategoryItems();
  }
}

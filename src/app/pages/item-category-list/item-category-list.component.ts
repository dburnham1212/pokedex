import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Observable, concat } from 'rxjs';


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
export class ItemCategoryListComponent implements OnInit {
  constructor (private pokemonService: PokemonService, private router: ActivatedRoute) {

  }

  categoryId!: string;
  itemList: Array<any> = [];
  itemListToDisplay!: Array<any>;
  categoryTitle!: string;
  pageSize = 20;
  pageIndex = 0;
  pageOffset = 0;
  pageSizeOptions = [5, 10, 20];
  
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
    
    let maximumValue = 0;
    if(this.pageOffset + this.pageSize > this.itemList.length) {
      maximumValue = this.itemList.length;
    } else {
      maximumValue = this.pageOffset + this.pageSize;
    } 
    
    const observableList: Array<Observable<any>> = [];
    for(let i = this.pageOffset; i < maximumValue; i++) {
      observableList.push(this.pokemonService.getDetailByUrl(this.itemList[i].url));
    }
    this.itemListToDisplay=[];
    concat(
      ...observableList
    )
    .subscribe((result: any) => {
      // Altering names of items to make them more readable
      let newNameArr = result.name.split("-");
      for(let j = 0; j < newNameArr.length; j++) {
        newNameArr[j] = newNameArr[j].charAt(0).toUpperCase() + newNameArr[j].slice(1);
      }
      this.itemListToDisplay.push({
        name: newNameArr.join(" "),
        image: result.sprites.default,
        id: result.id
      })
    });
    
  }

  handlePageEvent(e: PageEvent): void {
    this.pageSize = e.pageSize
    this.pageIndex = e.pageIndex
    this.pageOffset = e.pageIndex * e.pageSize
    this.getCategoryItems();
  }
}

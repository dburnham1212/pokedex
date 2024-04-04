import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PokemonComponent } from './pages/pokemon/pokemon.component';
import { PokemonDetailsComponent } from './pages/pokemon-details/pokemon-details.component';
import { BerriesComponent } from './pages/berries/berries.component';
import { BerryDetailsComponent } from './pages/berry-details/berry-details.component';
import { ItemCategoriesComponent } from './pages/item-categories/item-categories.component';
import { ItemCategoryListComponent } from './pages/item-category-list/item-category-list.component';
import { ItemDetailsComponent } from './pages/item-details/item-details.component';

export const routes: Routes = [{
  path: "home",
  component: HomeComponent
},
{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full' 
},
{
  path: 'pokemon',
  component: PokemonComponent,
},
{
  path: 'pokemon/:id',
  component: PokemonDetailsComponent
},
{
  path: 'berries',
  component: BerriesComponent
},
{
  path: 'berries/:id',
  component: BerryDetailsComponent
},
{
  path: 'items',
  component: ItemCategoriesComponent
},
{
  path: 'items/category/:id',
  component: ItemCategoryListComponent
},{
  path: 'items/category/:categoryId/item/:itemId',
  component: ItemDetailsComponent
},];

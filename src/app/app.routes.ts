import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PokemonComponent } from './pages/pokemon/pokemon.component';

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
  component: PokemonComponent
}];

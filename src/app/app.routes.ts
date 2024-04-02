import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PokemonComponent } from './pages/pokemon/pokemon.component';
import { PokemonDetailsComponent } from './pages/pokemon-details/pokemon-details.component';
import { BerriesComponent } from './pages/berries/berries.component';

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
}];

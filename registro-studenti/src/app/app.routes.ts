import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Elenco } from './elenco/elenco';
import { Inserimento } from './inserimento/inserimento';
import { DettaglioStudente } from './dettaglio-studente/dettaglio-studente';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'elenco', component: Elenco },
  { path: 'elenco/:id', component: DettaglioStudente },
  { path: 'inserimento', component: Inserimento },
  { path: '**', redirectTo: 'home' },
];
